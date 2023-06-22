const express = require('express');
const router = express.Router();
const { isAdminAuth } = require('../middleware/isAuth');
const {
  login,
  verifyClient,
  allClients,
  allTalents,
  searchClients,
  deactivateClient,
  searchTalents,
  dashboard,
  bulkDelete,
  blockATalent,
  validate2Fa,
  mailATalent,
  mailAClient,
  updateATalent,
  updateAClient,
  deleteATalent,
  deleteAClient,
  talentProfile,
  clientProfile,
  bulkEmailClient,
  bulkEmailTalent,
  viewSingleJob,
  addAdminUser,
} = require('../controllers/admin_controller');

router.post('/login', login);

router.get('/clients', isAdminAuth, allClients);
router.get('/talents', isAdminAuth, allTalents);

router.put('/verify/:clientId', isAdminAuth, verifyClient);
router.put('/deactivate/:clientId', isAdminAuth, deactivateClient);

router.get('/search/clients/:key', isAdminAuth, searchClients);
router.get('/search/talents/:key', isAdminAuth, searchTalents);

router.get('/dashboard', isAdminAuth, dashboard);

router.post('/bulk-delete', isAdminAuth, bulkDelete);
router.post('/twofactor', validate2Fa);

router.post('/mail/talent', isAdminAuth, mailATalent);
router.post('/mail/client', isAdminAuth, mailAClient);

router.put('/update/talent/:id', isAdminAuth, updateATalent);
router.put('/update/client/:id', isAdminAuth, updateAClient);

router.delete('/remove/talent/:id', isAdminAuth, deleteATalent);
router.delete('/remove/client/:id', isAdminAuth, deleteAClient);

router.get('/view/talent/profile/:id', isAdminAuth, talentProfile);
router.get('/view/client/profile/:id', isAdminAuth, clientProfile);

router.post('/bulk/email/client', isAdminAuth, bulkEmailClient);
router.post('/bulk/email/talent', isAdminAuth, bulkEmailTalent);

router.get('/view/single/job/:id', isAdminAuth, viewSingleJob);

router.post('/add/new/admin', isAdminAuth, addAdminUser);

router.put('/block/talent/:id', isAdminAuth, blockATalent);

module.exports = router;
