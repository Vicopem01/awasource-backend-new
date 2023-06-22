// Node Controller
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENTID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACKURL
);

const Talent = require('../models/Talent');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { TALENT_JWT_SECRET } = process.env;
const expiry = 360000;
const cookie = require('cookie-parser');

exports.googleAuth = async (req, res) => {
  console.log('========reqbody');
  console.log(req.body);
  console.log('========reqbody');
  try {
    const { token } = req.body;
    // Verify generated token
    const { payload } = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENTID,
    });
    // Get user data from payload
    const email = payload.email;
    const givenName = payload.given_name;
    const familyName = payload.family_name;
    const googleId = payload.sub;

    console.log({ email, givenName, familyName, googleId });

    //check whether user exist in database
    const talentQuery = await Talent.findOne({
      email: email,
    });

    // If user exist, login directly
    if (talentQuery !== null) {
      const talent = talentQuery;

      //create token
      const token = await jwt.sign(
        {
          id: talent._id,
          email: talent.email,
          firstName: talent.firstName,
        },
        TALENT_JWT_SECRET,
        {
          expiresIn: '2d',
        }
      );
      console.log(token);
      // store token in cookie
      res.cookie('access-token', token);
      return res.status(200).json({
        status: 'success',
        message: 'login successful',
        data: {
          token,
          userId: user._id,
          firstName: user.firstName,
        },
      });
    }

    // Else register user and login
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('SpaceEeet12345678', salt);

    const nTalent = new Talent({
      firstName: `${givenName} ${familyName}`,
      email: email,
      password: defaultPassword,
      //provider: "google",
      googleId: googleId,
      emailToken: crypto.randomBytes(64).toString('hex'),
      isVerified: true,
      password: defaultPassword,
      confirm_password: defaultPassword,
    });

    const newTalent = await nTalent.save();

    if (!newTalent) {
      return res.status(400).json({
        status: 'error',
        message: 'user creation failed',
      });
    }

    //create token
    const talentToken = await jwt.sign(
      {
        id: newTalent._id,
        email: newTalent.email,
        firstName: newTalent.firstName,
      },
      TALENT_JWT_SECRET,
      {
        expiresIn: '2d',
      }
    );
    console.log(token);
    // store token in cookie
    res.cookie('access-token', talentToken);

    return res.status(200).json({
      status: 'success',
      message: 'login successful',
      data: {
        talentToken,
        talentId: newTalent._id,
        firstName: newTalent.firstName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: 'server error',
    });
  }
};
