require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    return console.log(`*   Failed to connect to the server: ${error}`);
  } else {
    console.log('*   The connection to the SMTP server has been successfully established.');
  }
});

module.exports = transporter;