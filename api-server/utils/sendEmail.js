const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey', // 🔑 Always 'apikey'
      pass: process.env.SENDGRID_API_KEY // from .env
    }
  });

  await transporter.sendMail({
    from: `"Courseboxd" <trojan854@gmail.com>`, // 🔥 Must exactly match verified sender in SendGrid
    to,
    subject,
    html
  });
};

module.exports = sendEmail;