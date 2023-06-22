const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const session = require("express-session");
const cookieSession = require("cookie-session");
const Client = require("../models/Client");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { isRegisteredWithGoogle } = require("../middleware/google-auth");

router.post("/api/v1/auth/google", isRegisteredWithGoogle, async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  const client = await Client.upsert({
    where: { email: email },
    update: { name, picture },
    create: { name, email, picture },
  });
  req.session.clientId = client.id;
  res.status(201);
  res.json(client);
});

module.exports = router;
