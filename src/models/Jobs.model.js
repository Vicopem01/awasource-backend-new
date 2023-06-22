const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    jobType: {
      type: String,
      enum: ['Gig', 'Job'],
    },
    title: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Part-Time', 'Full-Time', 'Internship'],
      default: 'Part-Time',
    },
    paymentFee: {
      type: String,
    },
    Description: {
      type: String,
    },
    location: {
      type: String,
    },
    objectives: {
      type: String,
    },
    responsibilities: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    skillsAndRequirements: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Jobs', jobsSchema);
