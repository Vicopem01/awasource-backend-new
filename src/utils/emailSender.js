const nodemailer = require('nodemailer');

const path = require('path');
const fs = require('fs');

const sendEmail = async (options, attachment = false) => {
  const transporter = nodemailer.createTransport({
    host: process.env.OUTSOURCE_SMTP_HOST,
    port: process.env.OUTSOURCE_SMTP_PORT,
    auth: {
      user: process.env.OUTSOURCE_SMTP_USER,
      pass: process.env.OUTSOURCE_SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  try {
    const message = {
      from: `${process.env.OUTSOURCE_EMAIL_FROM_NAME}  ${process.env.OUTSOURCE_SMTP_USER}`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.message,
    };

    const m = await transporter.sendMail(message);
    console.log(m);
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendEmail;
