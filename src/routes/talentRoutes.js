const path = require('path');
const express = require('express');
require('dotenv').config();
const fs = require('fs');
const router = new express.Router();
const multer = require('multer');

const talentController = require('../controllers/talent_controller');
const googleAuthController = require('../controllers/google_controller');
const { isAuthTalent } = require('../middleware/isAuth');
const uploadPdf = require('../utils/pdfUpload');
const upload = require("../utils/multer");

router.post("/signup", talentController.create);
router.post("/login", talentController.login);
router.put("/forgot-password", talentController.forgotPassword);
router.put("/reset-password", talentController.resetPassword);
router.put(
  "/personal/info",
  upload.array("images", 2),
  // upload.single("proofOfIdentity"),  
  isAuthTalent,
  talentController.personalInfo
);
router.put('/education', isAuthTalent, talentController.education);
router.put('/skills', isAuthTalent, talentController.skills);
router.put('/work-history', isAuthTalent, talentController.workHistory);
router.put(
  '/work-compensation',
  isAuthTalent,
  talentController.workCompensation
);
router.post('/verify/otp', talentController.verifyOtp);
router.get('/profile-reviews', isAuthTalent, talentController.profileReview);
router.post('/resendOtp', talentController.resendOtp);
router.post('/report/behavior', isAuthTalent, talentController.reportBehavior);
router.post('/auth/google', googleAuthController.googleAuth);

// Complains
router.post('/contact-us', isAuthTalent, talentController.contactUs);
router.post('/log/bugs', isAuthTalent, talentController.logABug);

// Video upload
router.put(
  '/video/upload',
  isAuthTalent,
  upload.array('video', 2),
  talentController.uploadVideo
);

//Upload pdf
router.put(
  '/upload-pdf',
  isAuthTalent,
  uploadPdf.single('myFile'),
  talentController.uploadPdf
);



module.exports = router;
