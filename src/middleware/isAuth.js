const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { CLIENT_JWT_SECRET, TALENT_JWT_SECRET, ADMIN_JWT_SECRET } = process.env;

exports.isAuthUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json('Token Is missing');

    const decoded = await jwt.verify(token, CLIENT_JWT_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.client = decoded;

    next();
  } catch (e) {
    return res.status(401).json('signUp as client || Token expired ');
  }
};

exports.isAdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json('Token Is missing');

    const decoded = await jwt.verify(token, ADMIN_JWT_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.admin = decoded;
    next();
  } catch (e) {
    return res.status(401).json('signUp as admin || Token expired ');
  }
};

exports.isAuthTalent = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json('Token Is missing');

    const decoded = await jwt.verify(token, TALENT_JWT_SECRET);
    if (!decoded) {
      throw new Error();
    }
    console.log('========================================================');
    console.log('========================================================');
    req.talent = decoded;
    console.log(req.talent);
    console.log('=====================================================');
    console.log('=====================================================');
    next();
  } catch (e) {
    return res.status(401).json('signUp as talent || Token expired ');
  }
};
