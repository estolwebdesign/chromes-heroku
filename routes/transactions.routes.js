const { authJwt } = require("../middlewares");
const { transactionsController: controller } = require("../controllers/transactions.controller");
const { messagesController } = require("../controllers/messages.controller")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/transactions/create", [authJwt.verifyToken, authJwt.isUser], controller.newTransaction);
  app.post("/api/transactions/:id", [authJwt.verifyToken, authJwt.isUser], controller.getUserTransactions);
  app.put("/api/transactions/select-chrome/:id/:userId", [authJwt.verifyToken, authJwt.isUser], controller.selectChrome);
  app.put("/api/transactions/accept/:id/:userId", [authJwt.verifyToken, authJwt.isUser], controller.accept);
  app.put("/api/transactions/cancel/:id/:userId", [authJwt.verifyToken, authJwt.isUser], controller.cancel);
  app.put("/api/transactions/close/:id/:userId", [authJwt.verifyToken, authJwt.isUser], controller.close);
  app.put("/api/transactions/rate/:id", [authJwt.verifyToken, authJwt.isUser], controller.rate);

  app.post("/api/messages/new-message", [authJwt.verifyToken, authJwt.isUser], messagesController.send);
  app.post("/api/new-contact", messagesController.newContact);

};
