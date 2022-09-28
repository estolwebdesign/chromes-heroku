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
  app.post("/api/auth/validate-token/:token", controller.validResetToken);
  app.put("/api/auth/set-new-password/:token", controller.newPassword);

  // user controller
  app.post("/api/users/count", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.count);
  app.post("/api/users/get-all", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.getAll);
  app.post("/api/users/get-one/:id", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.getOne);
  app.post("/api/users/chromes-count", [authJwt.verifyToken, authJwt.isAdminOrModerator], userController.userChromesCount);
  app.post("/api/users/add-chrome/:userId/:chromeId", [authJwt.verifyToken, authJwt.isUser], userController.addChrome);
  app.put("/api/users/remove-chrome/:userId/:chromeId", [authJwt.verifyToken, authJwt.isUser], userController.removeChrome);
  app.post("/api/users/set-location/:id", [authJwt.verifyToken, authJwt.isUser], userController.setLocation);
  app.post("/api/users/get-nearest/:id/:distance", [authJwt.verifyToken, authJwt.isUser], userController.getNearestUsers);
  app.post("/api/users/get-repeated/:id", [authJwt.verifyToken, authJwt.isUser], userController.getRepeated);
};
