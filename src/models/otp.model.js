const { Schema, model } = require('mongoose');

module.exports.Otp = model(
  'Otp',
  Schema(
    {
      email: {
        type: String,
      },
      otp: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }, //deletes after 5 minutes automatically from the db
      },
    },
    { timestamps: true }
  )
);
