const db = require("../models");
const Message = db.message;
const Transaction = db.transaction;

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
};
