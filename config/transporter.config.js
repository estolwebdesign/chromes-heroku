const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "contact@chromesw.app",
    pass: "Rominola/1995",
  },
});
