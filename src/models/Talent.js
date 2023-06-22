const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { TALENT_JWT_SECRET } = process.env;
// Creating Talent schema
const talentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },
    photo: {
      type: String,
    },
    phone: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255
    },
    portfolioLink: {
      type: String,
    },
    confirm_password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
    role: {
      type: String,
      enum: ["Talent", "Client", "Admin"],
      default: "Talent",
    },
    resetLink: {
      data: String,
      default: "",
    },
    // Upload Resume
    resumeTextContent: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    // Personal information
    currentLocation: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
    driversLicense: {
      type: String,
    },
    webSiteUrl: {
      type: String,
    },
    summary: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      default: "Male",
    },
    linkedInUrl: {
      type: String,
    },
    nationalId: {
      type: String,
    },
    workMode: {
      type: [String],
      enum: ["Work Remotely", "Open to relocate", "Onsite"],
      default: "Onsite",
    },
    proofOfAddress: {
      type: String,
    },
    proofOfIdentity: {
      type: String,
    },

    // Educational Background

    educations: [],

    //Skills
    primarySkills: {
      type: [String],
    },

    abilities: {
      teamManagement: {
        type: String,
      },
      teamWork: {
        type: String,
      },
      pressure: {
        type: String,
      },
      collaboration: {
        type: String,
      },
      agreeToEmails: {
        type: Boolean,
        default: false,
      },
      planning: {
        type: String,
      },
      organized: {
        type: String,
      },
      clientRelationship: {
        type: String,
      },
      creativity: {
        type: String,
      },
      sales: {
        type: String,
      },
    },
    secondarySkills: {
      type: [String],
    },

    // Work History and Experience
    workHistoryExperience: [],
    videoUrl: {
      type: [String],
    },

    video: {
      type: String,
    },

    // Work compensation
    desiredCompensation: {
      lowestAmount: {
        type: String,
      },
      highestAmount: {
        type: String,
      },
    },
    specificPriorities: {
      type: [String],
    },
  },
  {
    timestamps: true,
    versionkey: false,
  }
);

talentSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.TALENT_JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};
const Talent = mongoose.model('Talent', talentSchema);
module.exports = Talent;
