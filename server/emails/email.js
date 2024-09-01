const nodemailer = require("nodemailer");

const generateRegisterHTML = (id) => {
  return `
      <div style="text-align: center; height: 500px;">
        <h2 style="font-weight: 500; color: black";>Verify your email address</h2>
        <hr class="solid" style="width: 50%; border: 1px solid #ededed;">
        <p style="color: gray; font-size: 15px;">In order to use your hikepack account, you need to confirm your email address.</p>
        <a href="${process.env.EMAIL_URL}/verify-account/${id}"><button style="padding: 15px; margin-bottom: 15px; border: none; color: white; width: 300px; background-color: #08CA28";>Verify your email address</button></a>
        <hr class="solid" style="margin-bottom: 15px; width: 75px; border: 1px solid #ededed;">
        <span style="color: gray; font-size: 12px;">if you did not sign up for this account, you can ignore this email and the account will be deleted.</span>
      </div>
    `;
};

const generateForgotPasswordHTML = (id) => {
  return `
      <div style="text-align: center; height: 500px;">
        <h2 style="font-weight: 500; color: black";>Forgotten your password?</h2>
        <hr class="solid" style="width: 50%; border: 1px solid #ededed;">
        <p style="color: gray; font-size: 15px;">We're sending you this email because you requested a password reset. Click on this link to create a new password:</p>
        <a href="${process.env.EMAIL_URL}/new-password/${id}"><button style="padding: 15px; margin-bottom: 15px; border: none; color: white; width: 300px; background-color: #08CA28";>Set a new password</button></a>
        <hr class="solid" style="margin-bottom: 15px; width: 75px; border: 1px solid #ededed;">
        <span style="color: gray; font-size: 12px;">if you did not request a password reset, you can ignore this email. Your password will not be changed.</span>
      </div>
    `;
};

const reportEmail = (title, content, user) => {
  return `
      <div style="text-align: center; height: 500px;">
        <h2 style="font-weight: 500; color: black";>${title}</h2>
        <hr class="solid" style="width: 50%; border: 1px solid #ededed;">
        <p style="color: gray; font-size: 15px;">${content}</p>
        <hr class="solid" style="margin-bottom: 15px; width: 75px; border: 1px solid #ededed;">
        <span style="color: gray; font-size: 12px;">${user.username} - ${user.email}</span>
      </div>
    `;
};

const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: recipientEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email" };
  }
};

const sendReportEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: recipientEmail,
      to: process.env.EMAIL,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email" };
  }
};

module.exports = {
  generateRegisterHTML,
  generateForgotPasswordHTML,
  reportEmail,
  sendEmail,
  sendReportEmail,
};
