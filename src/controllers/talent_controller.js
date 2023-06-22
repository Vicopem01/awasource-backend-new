const express = require("express");
const cloudinary = require("cloudinary");
const fs = require("fs");
const axios = require("axios");
const Talent = require("../models/Talent");
const { Otp } = require("../models/otp.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailSender");

const {
  sendEmailTemp,
  forgotPasswordTemplate,
} = require("../utils/template/emailTemplate");
const { passwordStrength } = require("check-password-strength");
const { TALENT_JWT_SECRET } = process.env;
const _ = require("lodash");
require("dotenv").config();
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const { errorResMsg, successResMsg } = require("../lib/response");
const catchAsync = require("../lib/catchAsync");
const { validateLogin, validateReg } = require("../validation/joiValidation");

const {
  Contact,
  LogABug,
  ReportBehavior,
} = require("../models/reportBehavior.mode");
const Client = require("../models/Client");

const URL = "http://outsource.com";

// Creating a new Talent on signUp
module.exports.create = catchAsync(async (req, res, next) => {
  const { email, password, linkedInUrl, confirm_password, agreeToEmails } =
    req.body;

  const validateData = validateReg.validateAsync(req.body);

  const checkPasswordStrength = passwordStrength(password);
  if (
    checkPasswordStrength.value === "Too weak" ||
    checkPasswordStrength.value === "Weak"
  ) {
    return errorResMsg(res, 400, "Password is weak");
  }

  if (!(email || password || confirm_password || linkedInUrl)) {
    return errorResMsg(res, 400, "Please fill all the fields");
  }

  let alreadyExist = await Talent.findOne({ email });
  let linkedInExist = await Talent.findOne({ linkedInUrl });
  if (alreadyExist) {
    return errorResMsg(res, 400, "Email already exists...");
  }

  if (linkedInExist) {
    return errorResMsg(res, 400, "This Linkedin URL has already been used");
  }
  const client = await Client.findOne({ email });
  if (client) {
    return errorResMsg(
      res,
      409,
      "This email has already been associated with another registered account and cannot be re-used."
    );
  }

  // Password Verification
  if (password != confirm_password)
    return errorResMsg(res, 409, "Conflict... Password Does not match...");
  const OTP = `${Math.ceil(Math.random() * 900000) + 100000}`;

  //Hashing Passwords
  const otp = new Otp({ email: email, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const saltPassword = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, saltPassword);

  // Creating a new Talent object
  let talent = new Talent({
    email,
    password: hashPassword,
    confirm_password: hashPassword,
    isVerified: false,
    linkedInUrl,
    agreeToEmails,
  });

  // Saving new Talent
  const createdTalent = await talent.save();
  const result = await otp.save();

  // Sending Registration mail
  await sendEmail({
    email: talent.email,
    subject: "Registration Details",
    message: await sendEmailTemp(OTP),
  });
  const dataInfo = {
    msg: "Talent successfully registered.",
  };
  return successResMsg(res, 201, dataInfo);
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const validateData = validateLogin.validateAsync(req.body);
  const talent = await Talent.findOne({ email });
  if (!talent || talent === null) {
    return errorResMsg(res, 400, "This email does not exist");
  }

  if (!talent.isVerified) {
    return errorResMsg(
      res,
      401,
      "Unverified account: Please check your email to verify your account.."
    );
  }

  if (!!talent.isBlocked) {
    console.log(talent.isBlocked);
    return errorResMsg(res, 401, "Your account has been blocked");
  }
  //talent login
  const confirmPassword = await bcrypt.compare(password, talent.password);
  if (!confirmPassword) {
    return errorResMsg(res, 400, "Password is incorrect");
  }

  //create token
  const token = await jwt.sign(
    {
      id: talent._id,
      email: talent.email,
    },
    TALENT_JWT_SECRET,
    {
      expiresIn: "2d",
    }
  );
  // store token in cookie
  res.cookie("access-token", token);
  const dataInfo = {
    message: "talent login successful",
    token,
    talentId: talent._id,
  };
  return successResMsg(res, 202, dataInfo);
});

//Reset password

module.exports.resetPassword = (req, res, next) => {
  const { resetLink, newPassword, confirmPassword } = req.body;

  // check if reset link exists
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.TALENT_RESET_PASSWORD_KEY,
      (error, decodedData) => {
        if (error) {
          return errorResMsg(res, 401, "Incorrect or expired token");
        }
        // if no error
        Talent.findOne({ resetLink }, async (err, talent) => {
          if (err || !talent) {
            return errorResMsg(
              res,
              400,
              "Talent with this token does not exist, please retry the forgot password reset again"
            );
          }

          const obj = {
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            resetLink: "",
          };

          //to update new password ini db
          talent = _.extend(talent, obj);
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPassword, salt);
          await talent.updateOne({ password: hashPassword });
          talent.save((err, result) => {
            if (err) {
              return errorResMsg(res, 400, "Reset password error");
            } else {
              return successResMsg(
                res,
                200,
                "Your password reset successfully"
              );
            }
          });
         
           //send email to user
          await sendEmail({
            email: talent.email,
            subject: "Password Reset Confirmation",
            message: await resetPasswordTemp(talent.firstName),
          });

        });
      }
    );
  } else {
    return errorResMsg(res, 401, "Authentication error!!!....");
  }
};

//Forgot password

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const checkTalent = await Talent.findOne({ email: email });

  if (!checkTalent) {
    return errorResMsg(res, 404, "User not found");
  } else {
    const token = await jwt.sign(
      { _id: checkTalent._id },
      process.env.TALENT_RESET_PASSWORD_KEY,
      { expiresIn: "20m" }
    );

    //send email to user
    await sendEmail({
      email: checkTalent.email,
      subject: "Outsource-reset password",
      message: await forgotPasswordTemplate(checkTalent.firstName, URL, token),
    });
    return checkTalent
      .updateOne({ resetLink: token }, (err, success) => {
        if (err) {
          return errorResMsg(res, 400, "Reset password link error");
        } else {
          const dataInfo = {
            message: "Password reset token sent to your email",
          };
          return successResMsg(res, 200, dataInfo);
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  }
};

//Work History
exports.workHistory = catchAsync(async (req, res) => {
  const id = req.talent.id;
  const { workHistoryExperience } = req.body;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized ...");
  }
  const checkTalent = await Talent.findById(id);
  if (!checkTalent) {
    return errorResMsg(res, 404, "Talent does not exist");
  }

  const talent = await Talent.findByIdAndUpdate(
    id,
    { workHistoryExperience: workHistoryExperience },
    {
      new: true,
    }
  ).select(
    "-email -password -abilities -skills -resetLink -createdAt -updatedAt -desiredCompensation -confirm_password -__v -role -isActive -isVerified -isBlocked -gender -workMode -videoUrl -pdfUrl -nationalId -summary -webSiteUrl -lastName -permanentAddress -dateOfBirth -primarySkills -secondarySkills -linkedInUrl"
  );
  if (!talent) {
    return errorResMsg(res, 400, "Talent Update Failed");
  }
  const dataInfo = {
    message: "Talent work history updated successfully",
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

//Work Compensation
exports.workCompensation = catchAsync(async (req, res, next) => {
  const {
    desiredCompensation: { lowestAmount, highestAmount },
    specificPriorities,
  } = req.body;
  if (!specificPriorities) {
    return errorResMsg(res, 400, "Please fill all fields");
  }
  const id = req.talent.id;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const checkTalent = await Talent.findById(id);
  if (!checkTalent) {
    return errorResMsg(res, 404, "Talent does not exist");
  }
  const talent = await Talent.findByIdAndUpdate(
    id,
    {
      specificPriorities,
      desiredCompensation: { lowestAmount, highestAmount },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!talent) {
    return errorResMsg(res, 400, "Talent Update Failed ");
  }
  return successResMsg(res, 200, "Work Compensation Updated Successfully");
});

// Skills
exports.skills = catchAsync(async (req, res, next) => {
  const id = req.talent.id;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized...");
  }
  const {
    primarySkills,
    secondarySkills,
    abilities: {
      teamManagement,
      teamWork,
      pressure,
      collaboration,
      planning,
      organized,
      clientRelationship,
      creativity,
      sales,
    },
  } = req.body;
  if (!(primarySkills || secondarySkills || abilities)) {
    return errorResMsg(res, 400, "Please fill all fields");
  }
  const talent = await Talent.findByIdAndUpdate(
    id,
    {
      primarySkills,
      secondarySkills,
      abilities: {
        teamManagement,
        teamWork,
        pressure,
        collaboration,
        planning,
        organized,
        clientRelationship,
        creativity,
        sales,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!talent) {
    return res.status(400).json("Talent Update Failed ");
  }
  const dataInfo = {
    message: "Talent Skills Update  Success",
  };
  return successResMsg(res, 200, dataInfo);
});

// Education
exports.education = catchAsync(async (req, res, next) => {
  const { id } = req.talent;
  const { educations } = req.body;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized...");
  }

  const talent = await Talent.findByIdAndUpdate(
    id,
    {
      educations: educations,
    },
    {
      new: true,
    }
  );
  const dataInfo = { message: "Education Updated Successfully" };
  return successResMsg(res, 200, dataInfo);
});

// Personal Info
exports.personalInfo = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    permanentAddress,
    currentAddress,
    currentLocation,
    nationalId,
    webSiteUrl,
    linkedInUrl,
    workMode,
    driversLicense,
    phoneNumber,
    summary,
  } = req.body;
  if (
    !(
      gender ||
      firstName ||
      lastName ||
      dateOfBirth ||
      permanentAddress ||
      currentAddress ||
      currentLocation ||
      nationalId ||
      webSiteUrl ||
      linkedInUrl ||
      workMode ||
      driversLicense ||
      phoneNumber ||
      summary
    )
  ) {
    return errorResMsg(res, 400, "Please fill all fields");
  }
  const { id } = req.talent;
  console.log(id, "==================");
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const baseUrl = "http://localhost:9009/";

  // upload multiple images to cloudinary by mapping through the array of images
  let imageArray = req.files.map((file) => {
    return file.path;
  });

  console.log(imageArray, "==================");

  const talent = await Talent.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      permanentAddress,
      currentAddress,
      currentLocation,
      nationalId,
      webSiteUrl,
      linkedInUrl,
      workMode,
      driversLicense,
      phoneNumber,
      summary,
      proofOfAddress: imageArray[0],
      proofOfIdentity: imageArray[1],
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!talent) {
    return errorResMsg(res, 400, "Talent Update Failed ");
  }
  const dataInfo = {
    message: "Personal Info Updated Successfully",
  };
  return successResMsg(res, 200, dataInfo);
});

module.exports.emailVerification = catchAsync(async (req, res, next) => {
  const token = req.query.token;
  const talent = await Talent.findOne({ emailToken: token });

  if (!talent) {
    return errorResMsg(res, 400, "Talent does not exist");
  }

  talent.emailToken = null;
  talent.isVerified = true;
  await talent.save();
  return successResMsg(
    res,
    "Success: Your email has been verified, please login to continue"
  );
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const otpHolder = await Otp.find({
    email: req.body.email,
  });
  if (otpHolder.length === 0) {
    const dataInfo = {
      message: "You used an expire otp",
    };
    return errorResMsg(res, 400, dataInfo);
  }

  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
  if (rightOtpFind.email === req.body.email && validUser) {
    const talent = await Talent.findOne({ email: req.body.email });

    const token = talent.generateJWT();
    talent.isVerified = true;
    await talent.save();
    const OTPDelete = await Otp.deleteMany({
      email: rightOtpFind.email,
    });
    const dataInfo = {
      message: "TALENT Registration Completed and Successful",
      token: token,
    };
    return successResMsg(res, 200, dataInfo);
  } else {
    return errorResMsg(res, 400, "Otp is wrong");
  }
});

exports.profileReview = catchAsync(async (req, res, next) => {
  const { id } = req.talent;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const talent_preview = await Talent.findOne({ _id: id }).select(
    "-password -confirm_password"
  );
  const dataInfo = {
    talent_preview,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const talent = await Talent.findOne({ email });
  if (!talent) {
    return errorResMsg(res, 400, "Talent does not exist");
  }
  const checkOtp = await Otp.findOne({ email: talent.email });
  if (checkOtp) {
    const dataInfo = {
      message: "Otp already sent",
    };
    return errorResMsg(res, 400, dataInfo);
  }
  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const otp = new Otp({ email: email, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  await sendEmail({
    email: talent.email,
    subject: "otp resent successfully",
    message: await sendEmailTemp(OTP),
  });
  const dataInfo = {
    message: "Otp sent successfully",
  };
  return successResMsg(res, 200, dataInfo);
});

exports.reportBehavior = catchAsync(async (req, res, next) => {
  const { id } = req.talent;
  const { fullName, email, summaryOfReport, issues } = req.body;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const reportBeh = new ReportBehavior({
    userId: id,
    fullName,
    email,
    summaryOfReport,
    issues,
  });
  const { userId, ...others } = reportBeh._doc;
  const dataInfo = { userId };
  return successResMsg(res, 200, dataInfo);
});

exports.contactUs = catchAsync(async (req, res, next) => {
  const { id } = req.talent;
  const { fullName, email, individualOrCompany, phoneNumber, howCanWeHelpYou } =
    req.body;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const contact_us = new Contact({
    userId: id,
    fullName,
    email,
    individualOrCompany,
    phoneNumber,
    howCanWeHelpYou,
  });
  const { userId, ...others } = contact_us._doc;
  const dataInfo = { userId };
  return successResMsg(res, 200, dataInfo);
});

exports.logABug = catchAsync(async (req, res, next) => {
  const { id } = req.talent;
  const { fullName, email, pageWhereBugWasFound, tellUsAboutTheBug } = req.body;
  if (!id) {
    return errorResMsg(res, 401, "Unauthorized");
  }
  const reportBugs = new LogABug({
    userId: id,
    fullName,
    email,
    pageWhereBugWasFound,
    tellUsAboutTheBug,
  });
  const { userId, ...others } = reportBugs._doc;
  const dataInfo = { userId };
  return successResMsg(res, 200, dataInfo);
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadMethod = async (file) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      file,
      (result) => {
        resolve({ url: result.url, id: result.public_id });
      },
      { resource_type: "auto" }
    );
  });
};

exports.uploadVideo = catchAsync(async (req, res, next) => {
  const id = req.talent.id;
  if (!id) {
    return res.status(401).json("unauthorized");
  }
  let pictureFiles = req.files;
  let urls = [];
  const files = req.files;
  if (!files) return res.status(400).json({ message: "No video attached!" });
  for (const file of files) {
    const { path } = file;
    console.log("=========path");
    console.log(path);
    console.log("=========path");
    const newPath = await cloudinaryUploadMethod(path);
    console.log("=========newPath");
    console.log(newPath);
    console.log("=========newPath");
    urls.push(newPath);
    console.log(urls);
  }

  let all_urls = [];
  urls.forEach((i) => {
    all_urls.push(i.url);
  });

  const updateTalentVideo = await Talent.findByIdAndUpdate(
    id,
    {
      videoUrl: all_urls,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await updateTalentVideo.save();
  const dataInfo = {
    updateTalentVideo,
  };

  return successResMsg(res, 200, dataInfo);
});

exports.uploadPdf = catchAsync(async (req, res) => {
  const { id } = req.talent;
  if (!id) {
    return res.status(401).json("unauthorized");
  }
  const baseUrl = "http://localhost:9009/";
  const checkTalent = await Talent.findByIdAndUpdate(id, {
    pdfUrl: baseUrl + req.file.filename,
  });
  const dataInfo = {
    msg: "Uploaded successfully",
    file: baseUrl + req.file.filename,
  };
  return successResMsg(res, 200, dataInfo);
});
