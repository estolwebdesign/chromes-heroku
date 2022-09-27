const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "contact@estebanolivera.com",
    pass: "Rominola/1995",
  },
});
