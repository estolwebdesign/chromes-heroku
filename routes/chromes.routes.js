const { authJwt } = require("../middlewares");
const { chromesController: controller } = require("../controllers/chromes.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/chromes/get-all", [authJwt.verifyToken, authJwt.isUser], controller.getAll);
  app.post("/api/chromes/create", [authJwt.verifyToken, authJwt.isAdminOrModerator], controller.create);
  app.get("/api/chromes/create-all", [authJwt.verifyToken, authJwt.isAdminOrModerator], controller.createAll);

  // user controller
};
