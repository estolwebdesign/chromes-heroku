const { authJwt } = require("../middlewares");
const { transactionsController: controller } = require("../controllers/transactions.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // admin routes
  app.post("/api/admin/transactions/get-all", [authJwt.verifyToken, authJwt.isAdminOrModerator], controller.getAll);
  app.post("/api/admin/transactions/get-one/:id", [authJwt.verifyToken, authJwt.isAdminOrModerator], controller.getOne);
};
