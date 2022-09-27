const { authJwt } = require("../middlewares");

exports.API = "EstebanGuillermoOliveraPereyra";

if (authJwt != undefined) {
  exports.ClientSecret = authJwt.isClient.secret;
} else {
  exports.ClientSecret = null;
}