const { authJwt } = require("../middlewares");
const { authController: controller } = require("../controllers/auth.controller");
const { userController } = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.get("/", (req, res) => {
    res.json({
      status: "api si running",
    });
  });

  app.post("/api/auth/sign-up", controller.signUp);
  app.post("/api/auth/sign-in", controller.signIn);
  app.post("/api/auth/check-signed", [authJwt.verifyToken, authJwt.isUser], controller.sendUser);
  app.post("/api/auth/sign-out", [authJwt.verifyToken, authJwt.isUser], controller.logout);
  app.post("/api/auth/forgot-password", controller.passwordResetToken);
  app.get("/api/auth/validate-token/:token", controller.validResetToken);
  app.put("/api/auth/set-new-password/:token", controller.newPassword);

  // user controller
  app.get("/api/users/count", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.count);
  app.get("/api/users/get-all", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.getAll);
  app.get("/api/users/get-one/:id", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.getOne);
  app.get("/api/users/chromes-count", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.userChromesCount);
  app.get("/api/users/add-chrome/:userId/:chromeId", [authJwt.verifyToken, authJwt.isUser], userController.addChrome);
  app.put("/api/users/remove-chrome/:userId/:chromeId", [authJwt.verifyToken, authJwt.isUser], userController.removeChrome);
  app.post("/api/users/set-location/:id", [authJwt.verifyToken, authJwt.isUser], userController.setLocation);
  app.get("/api/users/get-nearest/:id/:distance", [authJwt.verifyToken, authJwt.isUser], userController.getNearestUsers);
  app.get("/api/users/get-repeated/:id", [authJwt.verifyToken, authJwt.isUser], userController.getRepeated);
};
