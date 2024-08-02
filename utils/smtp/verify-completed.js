const transporter = require("../../smtp");
require("dotenv").config();

function send_verify_completed(email) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: process.env.DPANEL_NAME + " : Account verified",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #333; border-radius: 5px; color: #fff; padding: 10px; border-bottom: 1px solid #333; text-align: center;">
            <h2 style="font-size: 24px; font-weight: bold; margin: 0;">Congratulations, your account has been verified!</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">We are delighted to inform you that your account has been successfully verified. You can now enjoy all the features and benefits our platform has to offer.</p>
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">If you have any questions or need further assistance, please do not hesitate to contact us. We're here to help and ensure you have the best experience possible.</p>
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Thank you for being a part of our community. We look forward to serving you!</p>
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Best regards,<br>${process.env.DPANEL_NAME} Team</p>
          </div>
          <div style="border-radius: 5px; background-color: #333; color: #fff; padding: 10px; border-top: 1px solid #333; text-align: center;">
            <p style="font-size: 14px; color: #fff; margin: 0;">This is an automated message. Please do not reply to this message.</p>
            <p style="font-size: 14px; color: #fff; margin: 0;">Copyright 2024 ${process.env.DPANEL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {});
}

module.exports = send_verify_completed;
