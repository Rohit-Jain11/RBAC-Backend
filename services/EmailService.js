const nodemailer = require("../config/nodemailer.js");

const sendResetPasswordEmail = async (email, resetLink) => {
  await nodemailer.sendMail({
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link is valid only for 10 minutes.</p>
    `
  });
};

module.exports = { sendResetPasswordEmail };
