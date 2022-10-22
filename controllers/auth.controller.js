const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const PasswordResetToken = db.passwordResetToken;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { wellcomeEmail } = require("../html/welcomeEmail");

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "contact@chromesw.app",
    pass: "Rominola/1995",
  },
});

exports.authController = {
  signUp: (req, res) => {
    const user = new User({
      username: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      birth: req.body.birth,
      location: {
        lat: req.body.lat,
        lng: req.body.lng,
      },
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });

      const mailOptions = {
        to: user.email,
        from: "wellcome@chromesw.app",
        subject: "Bienvenido a ChromeSwapp!!",
        html: wellcomeEmail(user),
      }

      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      })
    });
  },

  signIn: (req, res) => {
    try {
      User.findOne({
        $or: [{ username: req.body.user }, { email: req.body.email }],
      })
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }

          var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!",
            });
          }

          var token = jwt.sign({ id: user.id }, config.API, {
            expiresIn: 86400000, // 24 hours
          });

          var authorities = [];

          for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          }

          res.cookie("token", token, {
            httpOnly: true,
            maxAge: 86400000,
            secure: true,
          });
          res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            chromes: user.chromes,
            repeated: user.repeated,
            transactions: user.transactions,
            location: user.location,
          });
        });
    } catch (err) {
      console.error(err.message)
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  sendUser: async (req, res) => {
    try {
      User.findById(req.userId)
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }

          var authorities = [];

          for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          }

          res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            chromes: user.chromes,
            repeated: user.repeated,
            transactions: user.transactions,
            location: user.location,
          });
        });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  signOut: (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        secure: true,
      });
      res.status(200).json({
        status: "success",
        message: "signed out",
      });
    } catch (err) {
      return status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  passwordResetToken: async (req, res) => {
    if (!req.body.email) {
      res.status(500).json({
        status: "error",
        message: "Email is required",
      });
      return;
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "No user regitered with this email",
      });
      return;
    }
    const token = crypto.randomBytes(16).toString("hex");
    var resettoken = new PasswordResetToken({
      _userId: user._id,
      resettoken: token,
    });
    resettoken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      PasswordResetToken.find({
        _userId: user._id,
        resettoken: { $ne: resettoken.resettoken },
      })
        .remove()
        .exec();
      res.status(200).json({ message: "Reset Password successfully." });
      var transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: "contact@chromesw.app",
          pass: "Rominola/1995",
        },
      });
      var mailOptions = {
        to: user.email,
        from: "password-reset@chromesw.app",
        subject: "Reseteo de contraseña",
        text:
          "Recibió este correo electrónico porque usted, u otra persona, ha solicitado el restablecimiento de la contraseña de su cuenta ChromeSwap.\n\n" +
          "Haga clic en el siguiente enlace, o copie y péguelo en la barra de direcciones de su navegador para completar el proceso:\n\n" +
          "http://localhost:3000/reset-password/" +
          resettoken.resettoken +
          "\n\n" +
          "Si no fue usted quien lo solicitó, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n",
      };
      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
    });
  },

  validResetToken: async (req, res) => {
    if (!req.params.token) {
      return res.status(500).json({ message: "Token is required" });
    }
    const user = await PasswordResetToken.findOne({
      resettoken: req.params.token,
    });
    if (!user) {
      return res.status(409).json({ message: "Invalid URL" });
    }

    User.findOneAndUpdate({ _id: user._userId })
      .then(() => {
        res.status(200).json({ message: "Token verified successfully." });
      })
      .catch((err) => {
        return res.status(500).send({ msg: err.message });
      });
  },

  sendUser: async (req, res) => {
    try {
      console.log(req.body);
      await User.findByIdAndUpdate(req.userId, { location: req.body.location });
      User.findById(req.userId)
        .populate("roles", "-__v")
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }

          var authorities = [];

          for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
          }

          res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            chromes: user.chromes,
            repeated: user.repeated,
            transactions: user.transactions,
            location: user.location,
          });
        });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  newPassword: (req, res) => {
    PasswordResetToken.findOne({ resettoken: req.params.token }, function (err, userToken, next) {
      if (!userToken) {
        return res.status(409).json({ message: "Token has expired" });
      }

      User.findOne(
        {
          _id: userToken._userId,
        },
        function (err, userEmail, next) {
          if (!userEmail) {
            return res.status(409).json({ message: "User does not exist" });
          }
          return bcrypt.hash(req.body.newPassword, 8, (err, hash) => {
            if (err) {
              return res.status(400).json({ message: "Error hashing password" });
            }
            userEmail.password = hash;
            userEmail.save(function (err) {
              if (err) {
                return res.status(400).json({ message: "Password can not reset." });
              } else {
                userToken.remove();
                return res.status(201).json({ message: "Password reset successfully" });
              }
            });
          });
        }
      );
    });
  },

  logout: async (req, res) => {
    try {
      res.cookie("token", "none", {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
      });
      return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
