const db = require("../models");
const User = require("../models/user.model");
const Transaction = db.transaction;
const nodemailer = require("nodemailer");
const { newTransactionEmail } = require("../html/newTransactionEmail");

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "contact@chromesw.app",
    pass: "Rominola/1995",
  },
});

exports.transactionsController = {
  newTransaction: async (req, res) => {
    try {
      const newTransaction = await Transaction.create(req.body);
      if (!newTransaction) {
        return res.status(400).json({
          status: "error",
          message: "transaction could not be created",
        });
      }
      Promise.all([User.findByIdAndUpdate(req.body.from, { $push: { transactions: newTransaction._id } }), User.findByIdAndUpdate(req.body.to, { $push: { transactions: newTransaction._id } })]);

      const transaction = await Transaction.findById(newTransaction._id).populate([
        {
          path: "from",
          select: "username email",
        },
        {
          path: "to",
          select: "username email",
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
      ]);

      const mailOptions = {
        to: transaction.to.email,
        from: "new-transaction@chromesw.app",
        subject: "Nueva solicitud de intercambio",
        html: newTransactionEmail(transaction),
      }

      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      })

      return res.status(201).json({
        status: "success",
        message: "transaction was send",
        transaction: transaction,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  acceptOrReject: async (req, res) => {
    try {
      const updated = await Transaction.findByIdAndUpdate(req.params.id, { accepted: req.body.accepted }, { new: true });
      if (!updated) {
        return res.status(400).json({
          status: "error",
          message: "transaction could not be updated",
        });
      }
      return res.status(200).json({
        status: "success",
        message: `transaction was ${updated.accepted ? "accepted" : "rejected"}`,
        transaction: updated,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getUserTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.find({ $or: [{ from: req.params.id }, { to: req.params.id }] }).populate([
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
        },
      ]);

      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  selectChrome: async (req, res) => {
    try {
      await Transaction.findByIdAndUpdate(req.params.id, { $set: { "chromes.drop": req.body.chrome } });
      const transactions = await Transaction.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] }).populate([
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
        },
      ]);

      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  accept: async (req, res) => {
    try {
      await Transaction.findByIdAndUpdate(req.params.id, {
        accepted: true,
        cancelled: null,
      });
      const transactions = await Transaction.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] }).populate([
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
        },
      ]);
      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  cancel: async (req, res) => {
    try {
      await Transaction.findByIdAndUpdate(req.params.id, {
        accepted: null,
        cancelled: true,
      });
      const transactions = await Transaction.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] }).populate([
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
        },
      ]);
      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  close: async (req, res) => {
    try {
      await Transaction.findByIdAndUpdate(req.params.id, {
        accepted: null,
        cancelled: null,
        closed: true,
      });
      const transactions = await Transaction.find({ $or: [{ from: req.params.userId }, { to: req.params.userId }] }).populate([
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
        },
      ]);
      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  rate: async (req, res) => {
    try {
      const trans = await Transaction.findById(req.params.id).populate(["from", "to"]);

      let user;

      if (trans.from._id.toString() === req.body.author) {
        await Transaction.findByIdAndUpdate(req.params.id, {
          $set: { "userRates.recipiant.rate": req.body.rating, "userRates.recipiant.value": req.body.value.length > 0 ? req.body.value : null },
        });
        user = await User.findById(trans.to._id);
      }

      if (trans.to._id.toString() === req.body.author) {
        await Transaction.findByIdAndUpdate(req.params.id, {
          $set: { "userRates.offerer.rate": req.body.rating, "userRates.recipiant.value": req.body.value.length > 0 ? req.body.value : null },
        });
        user = await User.findById(trans.from._id);
      }

      const mailOptions = {
        to: user.email,
        from: "new-valoration@chromesw.app",
        subject: "Valoración recibida",
        html: valueRecivedEmail(trans, user),
      }

      transporter.sendMail(mailOptions, (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Server is ready to take our messages");
        }
      })

      const transactions = await Transaction.find({ $or: [{ from: req.body.author }, { to: req.body.author }] }).populate([
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
        },
      ]);
      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const transactions = await Transaction.find({})
        .populate([
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
            options: { sort: { createdAt: -1 } },
            select: "-transaction -receiver -__v",
            populate: {
              path: "remitter",
              select: "username",
            },
          },
        ])
        .sort({ closed: 1, createdAt: -1 })
        .lean();

      if (transactions.length < 1) {
        return res.status(404).json({
          status: "error",
          message: "no transactions could be found",
        });
      }

      return res.status(200).json({
        status: "success",
        transactions: transactions,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const transaction = await Transaction.findById(req.params.id)
        .populate([
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
        ])
        .lean();

      return res.status(200).json({
        status: "success",
        transaction: transaction,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
