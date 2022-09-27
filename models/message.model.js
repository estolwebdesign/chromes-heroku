const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const Message = model(
  "Message",
  new Schema(
    {
      transaction: {type: ObjectId, ref: "Transaction", required: true},
      remitter: {type: ObjectId, ref: "User", required: true},
      receiver: {type: ObjectId, ref: "User", required: true},
      content: {type: String, required: true},
      recivedAt: {type: Date, dafault: null},
      readAt: {type: Date, default: null},
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Message;
