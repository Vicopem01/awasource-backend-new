const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { SECRET } = process.env;
const expiry = 360000;

exports.isRegisteredWithGoogle = async (req, res) => {
  const { googleId } = req.body;
  try {
    const existingUser = await Client.findOne({ googleId });
    if (existingUser) {
      return res.status(400).json({
        message: "User exist, please signIn.",
      });
    }

    if (existingUser.googleId) {
      return res.status(400).json({
        message: "User email already exist, please signIn.",
      });
    } else {
      //create token
      const token = await jwt.sign(
        {
          id: existingUser._id,
          googleId: existingUser.googleId,
        },
        SECRET,
        {
          expiresIn: "2h",
        }
      );
      const createdUser = await existingUser.save();
      console.log(token);
      // store token in cookie
      res.cookie("access-token", token);
      return res.status(200).json({
        status: "success",
        message: "login successful ",
        data: {
          token,
          clientId: existingUser._id,
          googleId: existingUser.googleId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
