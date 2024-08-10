require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    return console.log(
      `*   \x1b[31m[ERROR]\x1b[0m : Failed to connect to the server: ${error}`,
    );
  } else {
    console.log(
      "*   \x1b[32m[SUCCESS]\x1b[0m : The connection to the SMTP server has been \x1b[32msuccessfully\x1b[0m established.",
    );
  }
});

module.exports = transporter;
