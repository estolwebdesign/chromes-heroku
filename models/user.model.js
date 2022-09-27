const { default: decimal2sexagesimalNext } = require("geolib/es/decimalToSexagesimal");
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
      repeated: [
        {
          chrome: { type: ObjectId, ref: "Chrome" },
          quantity: { type: Number },
        },
      ],
      transactions: [{ type: ObjectId, ref: "Transaction" }],
      location: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
