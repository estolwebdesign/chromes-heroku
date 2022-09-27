const mongoose = require("mongoose");

const ResetToken = mongoose.model(
  "PasswordResetToken",
  new mongoose.Schema({
    _userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Player",
    },
    resettoken: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  })
);

module.exports = ResetToken;
