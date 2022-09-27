const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const Transaction = model(
  "Transaction",
  new Schema(
    {
      from: { type: ObjectId, ref: "User", required: true },
      to: { type: ObjectId, ref: "User", required: true },
      chromes: {
        get: { type: ObjectId, ref: "Chrome", required: true },
        drop: { type: ObjectId, ref: "Chrome" },
      },
      messages: [{ type: ObjectId, ref: "Message" }],
      accepted: { type: Boolean, default: null },
      cancelled: { type: Boolean, default: null },
      closed: { type: Boolean, default: null },
      userRates: {
        offerer: {
          rate: { type: Number, min: 1, max: 5, default: null },
          value: { type: String, default: null },
        },
        recipiant: {
          rate: { type: Number, min: 1, max: 5, default: null },
          value: { type: String, default: null },
        },
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Transaction;
