const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

// Creating Talent schema
const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    firstName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    clientLogo: {
      type: String,
    },
    phone: {
      type: Number,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
    },
    role: {
      type: String,
      default: 'Client',
    },
    resetLink: {
      data: String,
      default: '',
    },
    emailToken: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
    confirm_password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
    industry: {
      type: [String],
    },
    companyType: {
      type: String,
      enum: ['Government', 'Individual', 'Private', 'Public'],
      default: 'Individual',
    },
    companySize: {
      type: Number,
    },

    companyName: {
      type: String,
    },
    emailAddress: {
      type: String,
    },
    companyWebsiteUrl: {
      type: String,
    },
    yearOfEstablishment: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    nationalIdentificationNumber: {
      type: String,
    },
    driverLicenseNumber: {
      type: String,
    },
    internationalPassport: {
      type: String,
    },
    taxIdentificationNumber: {
      type: String,
    },
    cacNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    employeeIdentificationNumber: {
      type: String,
    },
    facebookUrl: {
      type: String,
    },
    linkedInUrl: {
      type: String,
    },
    instagramUrl: {
      type: String,
    },
    twitterUrl: {
      type: String,
    },
    Summary: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    agreeToEmails: {
      type: Boolean,
      default: false,
    },
    stage: [],
  },
  {
    timestamps: true,
  }
);

clientSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.CLIENT_JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};
const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
