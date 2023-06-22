const express = require("express");
const router = express.Router();
const {
  registerProductLaunch,
} = require("../controllers/productlunch.controller");

router.post("/register", registerProductLaunch);

module.exports = router;
