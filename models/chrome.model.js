const { Schema, model } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const Chrome = model(
  "Chrome",
  new Schema(
    {
      section: {type: String, required: true},
      name: {type: String, required: true},
    },
    {
      timestamps: true,
    }
  )
);

module.exports = Chrome;
