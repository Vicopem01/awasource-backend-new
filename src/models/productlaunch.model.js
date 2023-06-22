const mongoose = require("mongoose");

const productLaunchSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    company: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductLaunch", productLaunchSchema);
