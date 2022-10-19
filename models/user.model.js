const {
  default: decimal2sexagesimalNext,
} = require("geolib/es/decimalToSexagesimal");
const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const User = model(
  "User",
  new Schema(
    {
      username: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      roles: [{ type: ObjectId, ref: "Role" }],
      chromes: [{ type: ObjectId, ref: "Chrome" }],
      birth: { type: String, require: true },
      repeated: [
        {
          chrome: { type: ObjectId, ref: "Chrome" },
          quantity: { type: Number },
        },
      ],
      transactions: [{ type: ObjectId, ref: "Transaction" }],
      location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
