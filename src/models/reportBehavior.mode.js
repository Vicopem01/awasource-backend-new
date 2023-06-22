const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportBehaviorSchema = Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Talent',
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    summaryOfReport: {
      type: String,
      required: true,
    },
    issues: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Talent',
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    individualOrCompany: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    howCanWeHelpYou: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const logABugSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Talent',
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pageWhereBugWasFound: {
      type: String,
      required: true,
    },
    tellUsAboutTheBug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LogABug = mongoose.model('LogABug', logABugSchema);
const Contact = mongoose.model('Contact', contactSchema);
const ReportBehavior = mongoose.model('ReportBehavior', reportBehaviorSchema);

module.exports = {
  LogABug,
  Contact,
  ReportBehavior,
};
