const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.chrome = require("./chrome.model");
db.message = require("./message.model");
db.passwordResetToken = require("./resetToken.model");
db.role = require("./role.model");
db.transaction = require("./transaction.model");
db.user = require("./user.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
