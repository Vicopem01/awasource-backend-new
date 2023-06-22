const express = require('express');
const router = new express.Router();
const upload = require('../utils/multer');
const clientController = require('../controllers/client_controller');
const { isAuthUser } = require('../middleware/isAuth');

router.get('/posted-jobs', clientController.postedJobs);

router.post('/signup', clientController.create);
router.post('/login', clientController.login);

router.get('/jobs', clientController.allJobs);

router.post('/verify/otp', clientController.verifyOtp);
router.get('/jobs', isAuthUser, clientController.getJobs);
router.get('/profile', isAuthUser, clientController.clientProfile);

router.put(
  '/upload/company/logo',
  isAuthUser,
  upload.single('image'),
  clientController.uploadLogo
);
router.post('/forgot/password', clientController.forgotPassword);
router.post('/reset/password', clientController.resetPassword);
router.put('/company/type', isAuthUser, clientController.clientCompanyType);
router.put('/company/info', isAuthUser, clientController.companyInformation);
router.put('/additional/info', isAuthUser, clientController.additionalInfo);

router.post('/newjobs', isAuthUser, clientController.addNewJobs);
router.put('/profile/verified/:id', clientController.profileVerified);
router.put('/client/info', isAuthUser, clientController.clientInfo);
router.put('/change/password', isAuthUser, clientController.changePassword);

router.post('/contact-us', isAuthUser, clientController.contactUs);
router.post('/log/bugs', isAuthUser, clientController.logABug);
router.post('/report/behavior', isAuthUser, clientController.reportBehavior);

//new advance search
router.get('/advance/search/:key', clientController.advancedSearch);

router.get('/talent-info/:id', isAuthUser, clientController.getTalentInfoById);
router.get(
  '/verified-talents',
  isAuthUser,
  clientController.allVerifiedTalents
);

router.post('/resendOtp', clientController.resendOtpMail);

module.exports = router;
