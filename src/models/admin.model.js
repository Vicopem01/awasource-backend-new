const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  admin_user_group: {
    type: String,
    enum: ['super_admin', 'admin', 'qa', 'editor', 'marketing', 'creative'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  isAuthorized: {
    type: Boolean,
    default: false,
  },

  activeSession: {
    type: Boolean,
    default: false,
  },
});

adminSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.ADMIN_JWT_SECRET,
    { expiresIn: "15s" }
  );
  return token;
};

module.exports = mongoose.model('Admin', adminSchema);
