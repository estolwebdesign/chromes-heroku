const { newContactEmail } = require("../html/newContactEmail");
const { newMessageEmail } = require("../html/newMessageEmail");
const db = require("../models");
const Message = db.message;
const User = db.user;
const Transaction = db.transaction;
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "contact@chromesw.app",
    pass: "Rominola/1995",
  },
});

exports.messagesController = {
  send: async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.body.transaction);
      if (!transaction.accepted) {
        return res.status(401).json({
          status: "error",
          message: "transaction must be accepted to start chatting",
        });
      }
      const message = await Message.create(req.body);
      const updatedTrans = await Transaction.findByIdAndUpdate(message.transaction, { $push: { messages: message._id } }, { new: true }).populate([
        {
          path: "from",
          select: "username",
        },
        {
          path: "to",
          select: "username",
        },
        {
          path: "chromes",
          populate: [
            {
              path: "get",
            },
            {
              path: "drop",
            },
          ],
        },
        {
          path: "messages",
          select: "-transaction -receiver -__v",
          populate: {
            path: "remitter",
            select: "username",
          },
          sort: { createdAt: -1 },
        },
      ]);
      const newMsg = await Message.findById(message._id, "-transaction -receiver -__v")
        .populate([{ path: "remitter", select: "username" }])
        .lean();
      return res.status(201).json({
        status: "success",
        transaction: updatedTrans,
        message: newMsg,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  newMessageMail: async (data) => {
    try {
      const user = await User.findById(data.receiver._id);
      const transaction = await Transaction.findById(data.transaction).populate([
        {
          path: "from",
          select: "username",
        },
        {
          path: "to",
          select: "username",
        },
        {
          path: "chromes",
          populate: [
            {
              path: "get",
            },
            {
              path: "drop",
            },
          ],
        },
        {
          path: "messages",
          select: "-transaction -receiver -__v",
          populate: {
            path: "remitter",
            select: "username",
          },
          sort: { createdAt: -1 },
        },
      ]);

      const mailOptions = {
        to: user.email,
        from: "nuevo-mensaje@chromesw.app",
        subject: "Nuevo mensaje recibido",
        html: newMessageEmail(transaction, user),
      }

      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      })
    } catch (err) {
      return console.error(err);
    }
  },

  newContact: async(req, res) => {
    try {
      const mailOptions = {
        to: "contact@chromesw.app",
        from: "new-contact@chromesw.app",
        subject: "Nueva solicitud de contacto",
        html: newContactEmail(req.body),
      }

      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      })

      return res.status(200).json({
        status: "success",
        message: "form send",
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message
      })
    }
  }
};
