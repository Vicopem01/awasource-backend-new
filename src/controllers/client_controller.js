const express = require('express');
const axios = require('axios');
const { Otp } = require('../models/otp.model');
const Jobs = require('../models/Jobs.model');
const bcrypt = require('bcrypt');
const Client = require('../models/Client');
const crypto = require('crypto');
const upload = require('../utils/multer');
const catchAsync = require('../lib/catchAsync');

const { CLIENT_JWT_SECRET } = process.env;
const { errorResMsg, successResMsg } = require('../lib/response');

const { cloudinary } = require('../utils/cloudinary');

const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailSender');
const SECRET = process.env.OUTSOURCE_SECRET;

const { LogABug, Contact, ReportBehavior } = require('../models/Report.model');
const Talent = require('../models/Talent');
const {
  forgotPasswordTemplateClient,
  signUpClientTemp,
} = require('../utils/template/emailTemplate');

const URL = 'http://outsource.com';

module.exports.create = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirm_password,
    position,
    companyName,
    emailToken,
    agreeToEmails,
    stage
  } = req.body;
  let alreadyExist = await Client.findOne({ email });

  if (alreadyExist) {
    return errorResMsg(res, 400, 'Email already exists');
  }

  let phoneAlreadyExist = await Client.findOne({ phone });
  if (phoneAlreadyExist) {
    return errorResMsg(res, 400, 'Phone number already exists');
  }
  const talent = await Talent.findOne({ email });
  if (talent) {
    return errorResMsg(
      res,
      409,
      'This email is already associated with another account and cannot be re-used'
    );
  }
  //Password Verification
  if (password != confirm_password)
    return errorResMsg(res, 409, 'Invalid credentials');
  // Generate OTP
  const OTP = `${Math.ceil(Math.random() * 900000) + 100000}`;

  //Hashing Passwords
  const otp = new Otp({ email: email, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const saltPassword = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, saltPassword);

  // Creating a new Client object
  let client = new Client({
    firstName,
    lastName,
    email,
    phone,
    password: hashPassword,
    confirm_password: hashPassword,
    isVerified: false,
    position,
    companyName,
    agreeToEmails,
  });

  // Saving new Client
  const createdClient = await client.save();
  const result = await otp.save();

  // Sending Registration mail
  await sendEmail({
    email: client.email,
    subject: 'Registration Details',
    message: await signUpClientTemp(createdClient.firstName, OTP),
  });
  const dataInfo = {
    success: true,
    message: 'Client successfully registered',
  };
  return successResMsg(res, 201, dataInfo);
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const client = await Client.findOne({ email });
  if (!client || client === null) {
    return errorResMsg(res, 400, 'This email does not exist');
  }
  if (!client.isVerified) {
    return errorResMsg(
      res,
      401,
      'Unverified account: please check your email to verify your account'
    );
  }

  const confirmPassword = await bcrypt.compare(password, client.password);
  if (!confirmPassword) {
    return errorResMsg(res, 400, 'Invalid Credentials');
  }
  //create token
  const token = await jwt.sign(
    {
      id: client._id,
      email: client.email,
      firstName: client.firstName,
    },
    process.env.CLIENT_JWT_SECRET,
    {
      expiresIn: '2d',
    }
  );
  res.cookie('access-token', token);
  const dataInfo = {
    status: 'success',
    message: 'login successful',
    token: token,
    clientId: client._id,
    firstName: client.firstName,
  };
  return successResMsg(res, 202, dataInfo);
});

module.exports.uploadLogo = catchAsync(async (req, res, next) => {
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const result = await cloudinary.uploader.upload(req.file.path);

  const clientLogoUpdate = await Client.findByIdAndUpdate(
    { _id: id },
    {
      clientLogo: result.secure_url,
    },
    {
      new: true,
    }
  );
  console.log(clientLogoUpdate);
  const dataInfo = {
    message: 'Logo uploaded successfully',
    clientLogoUpdate,
  };
  return successResMsg(res, 200, dataInfo);
});

module.exports.clientCompanyType = catchAsync(async (req, res, next) => {
  const { companySize, industry, companyType } = req.body;
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const updateCompanyType = await Client.findOneAndUpdate(
    id,
    {
      industry,
      companyType,
      companySize,
    },
    {
      new: true,
    }
  );
  const dataInfo = {
    updateCompanyType,
  };
  return successResMsg(res, 200, dataInfo);
});

module.exports.companyInformation = catchAsync(async (req, res, next) => {
  const {
    companyName,
    companyWebsiteUrl,
    position,
    yearOfEstablishment,
    companyAddress,
    taxIdentificationNumber,
    cacNumber,
    employeeIdentificationNumber,
  } = req.body;
  if (
    !(
      companyName ||
      companyWebsiteUrl ||
      position ||
      yearOfEstablishment ||
      companyAddress ||
      taxIdentificationNumber ||
      cacNumber ||
      employeeIdentificationNumber
    )
  ) {
    return errorResMsg(res, 400, 'Please fill all fields');
  }
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const updateCompanyInfo = await Client.findOneAndUpdate(
    id,
    {
      companyName,
      companyWebsiteUrl,
      position,
      yearOfEstablishment,
      companyAddress,
      taxIdentificationNumber,
      cacNumber,
      employeeIdentificationNumber,
    },
    {
      new: true,
    }
  );
  const dataInfo = {
    updateCompanyInfo,
  };
  return successResMsg(res, 200, dataInfo);
});

module.exports.additionalInfo = catchAsync(async (req, res, next) => {
  const { facebookUrl, linkedInUrl, instagramUrl, twitterUrl, Summary } =
    req.body;
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const additionCompanyInfo = await Client.findOneAndUpdate(
    id,
    {
      facebookUrl,
      linkedInUrl,
      instagramUrl,
      twitterUrl,
      Summary,
    },
    { new: true }
  );
  const dataInfo = {
    additionCompanyInfo,
  };
  return successResMsg(res, 200, dataInfo);
});

module.exports.emailVerification = catchAsync(async (req, res, next) => {
  const token = req.query.token;
  const client = await Client.findOne({ emailToken: token });

  if (!client) {
    return errorResMsg(res, 400, 'Client does not exist');
  }

  client.emailToken = null;
  client.isVerified = true;
  await client.save();

  const dataInfo = {
    message: 'Success: Your email has been verified, please login to continue',
  };
  return successResMsg(res, 200, dataInfo);
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const otpHolder = await Otp.find({
    email: req.body.email,
  });

  if (otpHolder.length === 0) {
    return errorResMsg(res, 400, 'You used an expired otp');
  }

  const rightOtpFind = otpHolder[otpHolder.length - 1];

  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
  if (rightOtpFind.email === req.body.email && validUser) {
    const client = await Client.findOne({ email: req.body.email });
    const token = client.generateJWT();
    client.isVerified = true;
    await client.save();
    const OTPDelete = await Otp.deleteMany({
      email: rightOtpFind.email,
    });
    const dataInfo = {
      message: 'Client Registration Completed and Successful',
      token: token,
    };
    return successResMsg(res, 200, dataInfo);
  } else {
    return errorResMsg(res, 400, 'Otp is wrong');
  }
});

exports.addNewJobs = catchAsync(async (req, res, next) => {
  const {
    jobType,
    title,
    type,
    paymentFee,
    Description,
    location,
    objectives,
    responsibilities,
    startDate,
    endDate,
    skillsAndRequirements,
    status,
  } = req.body;

  if (
    !(
      jobType ||
      title ||
      type ||
      paymentFee ||
      Description ||
      location ||
      objectives ||
      responsibilities ||
      startDate ||
      endDate ||
      skillsAndRequirements ||
      status
    )
  ) {
    return errorResMsg(res, 400, 'Please fill all fields');
  }

  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'unauthorized');
  }
  const newJob = new Jobs({
    jobType,
    title,
    type,
    paymentFee,
    Description,
    location,
    objectives,
    responsibilities,
    startDate,
    endDate,
    skillsAndRequirements,
    clientId: id,
    status,
  });
  await newJob.save();
  const dataInfo = {
    status: 'success',
    message: 'Job Added Successfully',
  };
  return successResMsg(res, 200, dataInfo);
});

exports.clientProfile = catchAsync(async (req, res, next) => {
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'unauthorized');
  }
  const client = await Client.find({ id }).select(
    '-confirm_password -password -isVerified'
  );
  return successResMsg(res, 200, { client: client });
});

exports.profileVerified = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const client = await Client.findByIdAndUpdate(
    id,
    {
      profileVerified: true,
    },
    { new: true }
  ).select('-confirm_password -password -isVerified');
  const dataInfo = {
    client,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.getJobs = catchAsync(async (req, res, next) => {
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const jobs = await Jobs.find({ clientId: id });
  const dataInfo = {
    jobs,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.postedJobs = catchAsync(async (req, res, next) => {
  const { type } = req.query;
  const jobs = await Jobs.find({
    type: type,
  });
  const dataInfo = {
    jobs,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.clientInfo = catchAsync(async (req, res, next) => {
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const updateClient = await Client.findOneAndUpdate(
    id,
    {
      ...req.body,
    },
    {
      new: true,
    }
  );
  const dataInfo = {
    updateClient,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  const id = req.client.id;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const client = await Client.findById(id);
  if (!client) {
    return errorResMsg(res, 404, 'Client not Found');
  }
  const isMatch = await bcrypt.compare(req.body.password, client.password);
  if (!isMatch) {
    return errorResMsg(res, 400, 'Invalid credentials');
  }
  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(newPassword, salt);

  client.password = hashPassword;
  client.confirm_password = hashPassword;

  await client.save();
  const dataInfo = {
    message: 'Password changed successfully',
  };
  return successResMsg(res, 200, dataInfo);
});

//Forgot password

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const checkClient = await Client.findOne({ email: email });

  if (!checkClient) {
    return errorResMsg(res, 404, 'Client not Found');
  } else {
    const token = await jwt.sign(
      { _id: checkClient._id },
      process.env.CLIENT_RESET_PASSWORD_KEY,
      { expiresIn: '20m' }
    );

    //send email to user
    await sendEmail({
      email: checkClient.email,
      subject: 'Outsource-reset password',
      message: await forgotPasswordTemplateClient(
        checkClient.firstName,
        URL,
        token
      ),
    });
    return checkClient
      .updateOne({ resetLink: token }, (err, success) => {
        if (err) {
          return res.status(400).json({
            message: 'Reset password link error',
          });
        } else {
          return res.status(200).json({
            message: 'Password reset token sent to your email',
          });
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
  }
});

module.exports.resetPassword = (req, res, next) => {
  const { resetLink, newPassword, confirmPassword } = req.body;

  // check if reset link exists
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.CLIENT_RESET_PASSWORD_KEY,
      (error, decodedData) => {
        if (error) {
          return errorResMsg(res, 401, 'Incorrect or expired token');
        }
        // if no error
        Client.findOne({ resetLink }, async (err, client) => {
          if (err || !client) {
            return errorResMsg(
              res,
              400,
              'Client with this token does not exist, please retry the forgot password reset again'
            );
          }

          const obj = {
            newPassword: newPassword,
            confirmPassword: confirmPassword,
            resetLink: '',
          };

          //to update new password ini db
          client = _.extend(talent, obj);
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(newPassword, salt);
          await client.updateOne({ password: hashPassword });
          //to save new password ini db
          talent.save((err, result) => {
            if (err) {
              return errorResMsg(res, 400, 'Reset password error');
            } else {
              const dataInfo = {
                message: 'Your password reset successfully',
              };
              return successResMsg(res, 200, dataInfo);
            }
          });
        });
      }
    );
  } else {
    return errorResMsg(res, 401, 'Authentication error');
  }
};

exports.allJobs = catchAsync(async (req, res, next) => {
  const jobs = await Jobs.find({});
  if (!jobs) {
    return errorResMsg(res, 404, "'No job found' ");
  } else {
    const dataInfo = {
      jobs,
    };
    return successResMsg(res, 200, dataInfo);
  }
});

exports.reportBehavior = catchAsync(async (req, res, next) => {
  const { id } = req.client;
  const { fullName, email, summaryOfReport, issues } = req.body;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const reportBeh = new ReportBehavior({
    userId: id,
    fullName,
    email,
    summaryOfReport,
    issues,
  });
  const { userId, ...others } = reportBeh._doc;
  const dataInfo = { userId, message: 'Report sent' };
  return successResMsg(res, 200, dataInfo);
});

exports.contactUs = catchAsync(async (req, res, next) => {
  const { id } = req.client;
  const { fullName, email, individualOrCompany, phoneNumber, howCanWeHelpYou } =
    req.body;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
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
  const { id } = req.client;
  const { fullName, email, pageWhereBugWasFound, tellUsAboutTheBug } = req.body;
  if (!id) {
    return errorResMsg(res, 401, 'Unauthorized');
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

exports.advancedSearch = catchAsync(async (req, res, next) => {
  let jobs = await Jobs.find({
    $or: [
      { title: { $regex: req.params.key } },
      { jobType: { $regex: req.params.key } },
      { type: { $regex: req.params.key } },
      { Description: { $regex: req.params.key } },
      { location: { $regex: req.params.key } },
      { skillsAndRequirements: { $regex: req.params.key } },
      { paymentFee: { $regex: req.params.key } },
      { startDate: { $regex: req.params.key } },
      { endDate: { $regex: req.params.key } },
      { objectives: { $regex: req.params.key } },
    ],
  });
  const dataInfo = {
    jobs,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.getTalentInfoById = catchAsync(async (req, res, next) => {
  const { id } = req.client;
  const client = await Client.findById({ _id: id });
  if (!client) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const talent = await Talent.findOne({ id: req.params.id }).select(
    '-password'
  );
  const dataInfo = {
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.allVerifiedTalents = catchAsync(async (req, res, next) => {
  const { id } = req.client;
  const client = await Client.findById({ _id: id });
  if (!client) {
    return errorResMsg(res, 401, 'Unauthorized');
  }
  const talents = await Talent.find({ isVerified: true }).select('-password');
  const dataInfo = {
    talents,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.resendOtpMail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const client = await Client.findOne({ email });
  if (!client) {
    return errorResMsg(res, 401, 'Unauthorized');
  }

  // Generate OTP
  const OTP = `${Math.ceil(Math.random() * 900000) + 100000}`;
  const otp = new Otp({ email: email, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  await otp.save();
  client.save();

  await sendEmail({
    email: client.email,
    subject: 'OTP for account verification',
    message: `<h2>Use the following OTP to verify your account</h2>
      <h1>${OTP}</h1>
      `,
  });
  const dataInfo = {
    message: 'OTP sent to your email',
  };

  return successResMsg(res, 200, dataInfo);
});
