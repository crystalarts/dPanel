const transporter = require('../../smtp');
require('dotenv').config();

function send_verify(email, token) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: process.env.DPANEL_NAME + ' : Account verification',
    html: `
      <html>
  <style>
    .button:hover {
      background-color: #444;
    }
  </style>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9;">
        <div class="container" style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div class="header" style="text-align: center; border-radius: 5px; background-color: #333; color: #fff; padding: 10px; border-bottom: 1px solid #333;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0;">Account Verification - Last Step!</h1>
          </div>
          <div class="content" style="padding: 20px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">Thank you for registering on our platform! We are excited to have you join our community.</p>
            <div class="action" style="margin-bottom: 20px;">
              <a href="http://localhost:3000/verify?token=${token}&email=${email}" class="button" style="background-color: #333; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">Verify Account</a>
            </div>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">If you cannot click the link, copy and paste the following URL into your browser:</p>
            <code style="display: block; background-color: #f9f9f9; padding: 5px; border-radius: 5px; margin-bottom: 20px;">http://localhost:3000/verify?token=${token}&email=${email}</code>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Important: If you do not verify your account within 72 hours, your account will be deleted.</p>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">If you have any questions or need assistance, feel free to contact us. We are here to help!</p>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Thank you for choosing our platform!</p>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Best regards,<br>${process.env.DPANEL_NAME} Team</p>
          </div>
          <div class="footer" style="text-align: center; border-radius: 5px; background-color: #333; color: #fff; padding: 10px; border-top: 1px solid #333;">
            <p style="font-size: 14px; color: #fff; margin: 0;">This is an automated message. Please do not reply to this message.</p>
            <p style="font-size: 14px; color: #fff; margin: 0;">Copyright 2024 ${process.env.DPANEL_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {});
}

module.exports = send_verify;