const mongoose = require('mongoose');

const  resetPasswordSchema = new mongoose.Schema(
  {
    talent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talent'
    },

    token: {
      type: String,
      required : true
    },

    valid: {
      trpe : Boolean,
      default: true,
    },
  },
  {
    timestamps: true
  },
);

const resetPasswordToken = mongoose.model( 
  'resetPasswordToken',
   resetPasswordSchema);

   module.exports = resetPasswordToken;