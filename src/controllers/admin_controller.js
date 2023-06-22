const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const Talent = require('../models/Talent');
const Jobs = require('../models/Jobs.model');
const { errorResMsg, successResMsg } = require('../lib/response');
const catchAsync = require('../lib/catchAsync');

const sendEmail = require('../utils/emailSender');
const AdminOtp = require('../models/admin.otp');

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || admin === null) {
    return errorResMsg(res, 401, "Invalid credentials");
  }
  const confirmPassword = await bcrypt.compare(password, admin.password);
  if (!confirmPassword) {
    return errorResMsg(res, 400, "Invalid credentials");
  }
  const generatedOtp = `${Math.ceil(Math.random() * 900000) + 100000}`;
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(generatedOtp, salt);

  const adminOtp = await AdminOtp.create({
    email: email,
    otp: hashedOtp,
  });

  const token = await jwt.sign(
    { id: admin._id, email: admin.email, otp: adminOtp.otp },
    process.env.ADMIN_JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // send email
  const message = `Your OTP is ${generatedOtp}`;
  await sendEmail({
    email: admin.email,
    subject: "OTP for login",
    message,
  });

  await admin.save();

  const dataInfo = {
    adminId: admin.id,
    token,
    hashedOtp,
  };
  res.cookie("access_token", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  return successResMsg(res, 200, dataInfo);
});

exports.validate2Fa = catchAsync(async (req, res, next) => {
  const cookie = req.cookies.access_token;

  const decode = await jwt.verify(cookie, process.env.ADMIN_JWT_SECRET);
  if (!decode || decode === null) {
    return errorResMsg(res, 401, "Invalid credentials, please login again");
  }
  const decodedEmail = decode.email;
  const saved_otp = decode.otp;

  const { otp } = req.body;

  // decode otp using bcrypt
  const decodedOtp = await bcrypt.compare(otp, saved_otp);
  if (!decodedOtp) {
    return errorResMsg(res, 400, "Invalid OTP");
  }

  const admin = await Admin.findOne({ email: decodedEmail });
  if (!admin) {
    return errorResMsg(res, 400, "Invalid OTP");
  }

  const token = await jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.ADMIN_JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  res.cookie("access_token", token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  const dataInfo = {
    adminId: admin.id,
    token,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.verifyClient = catchAsync(async (req, res, next) => {
  const id = req.admin.id;
  const clientId = req.params.clientId;

  const admin = await Admin.findById(id);
  if (!admin) {
    return errorResMsg(res, 401, "Unauthorized access");
  }

  const client = await Client.findOneAndUpdate(
    { _id: clientId },
    { isVerified: true },
    {
      new: true,
    }
  );
  const dataInfo = {
    clientId: client._id,
    isVerified: client.isVerified,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.deactivateClient = catchAsync(async (req, res, next) => {
  const id = req.admin.id;
  const clientId = req.params.clientId;

  const admin = await Admin.findById(id);
  if (!admin || admin === null) {
    return errorResMsg(res, 401, "Unauthorized access");
  }

  const client = await Client.findOneAndUpdate(
    { _id: clientId },
    { isVerified: false },
    {
      new: true,
    }
  );
  const dataInfo = {
    clientId: client._id,
    isVerified: client.isVerified,
    message: "Client deactivated successfully",
  };
  return successResMsg(res, 200, dataInfo);
});

exports.allClients = catchAsync(async (req, res, next) => {
  const id = req.admin.id;
  if (!id || id === null) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const clients = await Client.find({}).sort({ createdAt: -1 });

  const dataInfo = {
    counts: clients.length,
    data: clients,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.allTalents = catchAsync(async (req, res, next) => {
  const id = req.admin.id;
  if (!id || id === null) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const talents = await Talent.find({}).sort({ createdAt: -1 });

  const dataInfo = {
    counts: talents.length,
    data: talents,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.searchClients = catchAsync(async (req, res, next) => {
  let client = await Client.find({
    $or: [
      { email: { $regex: req.params.key } },
      { firstName: { $regex: req.params.key } },
      { lastName: { $regex: req.params.key } },
      // { phone: { $regex: req.params.key } }, // convert to string to user
      { industry: { $regex: req.params.key } },
      { companyType: { $regex: req.params.key } },
      { companySize: { $regex: req.params.key } },
      { status: { $regex: req.params.key } },
      { linkedInUrl: { $regex: req.params.key } },
      { employeeIdentificationNumber: { $regex: req.params.key } },
    ],
  });
  const dataInfo = {
    count: client.length,
    client,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.searchTalents = catchAsync(async (req, res, next) => {
  let talent = await Talent.find({
    $or: [
      { email: { $regex: req.params.key } },
      { firstName: { $regex: req.params.key } },
      { lastName: { $regex: req.params.key } },
      { nationalId: { $regex: req.params.key } },
      { driversLicense: { $regex: req.params.key } },
      { gender: { $regex: req.params.key } },
      // { phone: { $regex: req.params.key } },
    ],
  });
  const dataInfo = {
    count: talent.length,
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.dashboard = catchAsync(async (req, res, next) => {
  const id = req.admin.id;
  if (!id || id === null) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const admin = await Admin.findById(id);
  console.log(admin.isAuthorized);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const clients = await Client.find({ isVerified: true });
  const talents = await Talent.find({ isVerified: true });
  const jobs = await Jobs.find({});
  const dataInfo = {
    clients: clients.length,
    talents: talents.length,
    jobs: jobs.length,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.bulkDelete = catchAsync(async (req, res, next) => {
  const { ids } = req.body;
  if (!ids) {
    return errorResMsg(res, 400, "Invalid request");
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const clients = await Client.deleteMany({ _id: { $in: ids } });
  const talents = await Talent.deleteMany({ _id: { $in: ids } });
  const jobs = await Jobs.deleteMany({ _id: { $in: ids } });
  const dataInfo = {
    clients: clients.deletedCount,
    talents: talents.deletedCount,
    jobs: jobs.deletedCount,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.mailATalent = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return errorResMsg(res, 400, "Invalid request");
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const talent = await Talent.findById(id);
  if (!talent || talent === null) {
    return errorResMsg(res, 400, "Invalid request");
  }

  await sendEmail({
    email: talent.email,
    subject: "Talent Profile",
    message: `<p>Hi ${talent.firstName},</p>
      <p>You have been selected for a job. Please find your profile below:</p>`,
  });

  const dataInfo = {
    talent,
  };

  return successResMsg(res, 200, dataInfo);
});

exports.mailAClient = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return errorResMsg(res, 400, "Invalid request");
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, "Unauthorized access");
  }
  const client = await Client.findById(id);
  if (!client || client === null) {
    return errorResMsg(res, 400, "Invalid request");
  }

  await sendEmail({
    email: client.email,
    subject: "Client Profile",
    message: `<p>Hi ${client.firstName},</p>
      <p>You have been selected for a job. Please find your profile below:</p>
      <p>${client.firstName} ${client.lastName}</p>
      <p>${client.email}</p>
      <p>${client.phone}</p>
      <p>${client.companyName}</p>
      <p>${client.companyType}</p>
      <p>${client.companySize}</p>
      <p>${client.status}</p>
      <p>${client.linkedInUrl}</p>
      <p>${client.employeeIdentificationNumber}</p>`,
  });

  const dataInfo = {
    client,
  };

  return successResMsg(res, 200, dataInfo);
});

exports.addATalent = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    industry,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
    password,
    dateOfBirth,
    gender,
    currentLocation,
    permanentAddress,
    nationalId,
    workMode,
    webSiteUrl,
    driversLicense,
    summary,
    educations,
    workHistoryExperience,
    portfolioLink,
    desiredCompensation,
    specificPriorities,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !industry ||
    !companyType ||
    !companySize ||
    !status ||
    !linkedInUrl ||
    !employeeIdentificationNumber
  ) {
    return errorResMsg(res, 400, "Invalid request");
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, "Unauthorized access");
  }

  // upload image to cloudinary
  const result = await cloudinary.uploader.upload(req.file.path);
  const image = result.secure_url;

  const hashPassword = await bcrypt.hash(password, 10);

  const talent = await Talent.create({
    firstName,
    lastName,
    email,
    phone,
    industry,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
    password: hashPassword,
    dateOfBirth,
    gender,
    currentLocation,
    permanentAddress,
    nationalId,
    workMode,
    webSiteUrl,
    driversLicense,
    summary,
    photo: image,
    educations,
    workHistoryExperience,
    portfolioLink,
    desiredCompensation,
    specificPriorities,
  });
  const dataInfo = {
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.addAClient = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !companyName ||
    !companyType ||
    !companySize ||
    !status ||
    !linkedInUrl ||
    !employeeIdentificationNumber
  ) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const client = await Client.create({
    firstName,
    lastName,
    email,
    phone,
    companyName,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
  });
  const dataInfo = {
    client,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.updateATalent = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    industry,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
  } = req.body;

  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const talent = await Talent.findById(req.params.id);
  if (!talent || talent === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  talent.firstName = firstName;
  talent.lastName = lastName;
  talent.email = email;
  talent.phone = phone;
  talent.industry = industry;
  talent.companyType = companyType;
  talent.companySize = companySize;
  talent.status = status;
  talent.linkedInUrl = linkedInUrl;
  talent.employeeIdentificationNumber = employeeIdentificationNumber;
  await talent.save({ validateBeforeSave: false });
  const dataInfo = {
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.updateAClient = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    companyType,
    companySize,
    status,
    linkedInUrl,
    employeeIdentificationNumber,
  } = req.body;

  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const client = await Client.findById(req.params.id);
  if (!client || client === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  client.firstName = firstName;
  client.lastName = lastName;
  client.email = email;
  client.phone = phone;
  client.companyName = companyName;
  client.companyType = companyType;
  client.companySize = companySize;
  client.status = status;
  client.linkedInUrl = linkedInUrl;
  client.employeeIdentificationNumber = employeeIdentificationNumber;
  await client.save({ validateBeforeSave: false });
  const dataInfo = {
    client,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.deleteATalent = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const talent = await Talent.findByIdAndUpdate(
    req.params.id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!talent || talent === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  return successResMsg(res, 200, {});
});

exports.deleteAClient = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const client = await Client.findById(
    req.params.id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!client || client === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  return successResMsg(res, 200, {});
});

exports.talentProfile = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const talent = await Talent.findById(req.params.id);
  if (!talent || talent === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const dataInfo = {
    talent,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.clientProfile = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const client = await Client.findById(req.params.id);
  if (!client || client === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const dataInfo = {
    client,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.bulkEmailClient = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }

  const clients = await Client.find({});
  if (!clients || clients === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const emails = clients.map(async (client) => {
    const email = client.email;
    await sendEmail({
      email: email,
      subject: 'Client Profile',
      message: `<p>Hi ${client.firstName},</p>
        <p>You have been selected for a job. Please find your profile below:</p>`,
    });
  });

  return successResMsg(res, 200, {});
});

exports.bulkEmailTalent = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const talents = await Talent.find({});
  if (!talents || talents === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const emails = talents.map(async (talent) => {
    await sendEmail({
      to: talent.email,
      subject: 'Talent Profile',
      html: `<p>Hi ${talent.firstName},</p>
        <p>You have been selected for a job. Please find your profile below:</p>
  `,
    });
  });

  return successResMsg(res, 200, {});
});

exports.viewSingleJob = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const job = await Jobs.findById(req.params.id);
  if (!job || job === null) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const dataInfo = {
    job,
  };
  return successResMsg(res, 200, dataInfo);
});

exports.addAdminUser = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const {
    firstName,
    lastName,
    email,
    password,
    phone_number,
    status,
    admin_user_group,
  } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return errorResMsg(res, 400, 'Invalid request');
  }
  const adminUser = new Admin({
    firstName,
    lastName,
    email,
    password,
    confirm_password: password,
    phone_number,
    admin_user_group,
    status,
    isAuthorized: true,
  });
  await adminUser.save();
  return successResMsg(res, 200, {});
});

exports.blockATalent = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin || admin === null || admin.isAuthorized === false) {
    return errorResMsg(res, 401, 'Unauthorized access');
  }
  const talent = await Talent.findById(req.params.id);
  if (!talent || talent === null) {
    return errorResMsg(res, 401, 'Talent not found');
  }
  talent.isBlocked = true;
  await talent.save();

  return successResMsg(res, 200, {
    message: 'Talent blocked, contact Admin to unblock',
  });
});
