const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Client = db.client;
const Role = db.role;
const bcrypt = require("bcryptjs");

verifyToken = (req, res, next) => {
  let token = req.cookies.token;
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.API, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err.message });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

isAdminOrModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin" || roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin or moderator Role!" });
        return;
      }
    );
  });
};

isUser = async (req, res, next) => {
  const user = await User.findById(req.userId).populate("roles", "-__v");
  if (!user) {
    return res.status(403).send({ message: "User does not exists!" });
  }
  var authorities = [];

  for (let i = 0; i < user.roles.length; i++) {
    authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
  }

  // res.status(200).json({
  //   id: user._id,
  //   username: user.username,
  //   email: user.email,
  //   roles: authorities,
  // });
  return next();
};

isClient = (req, res, next) => {
  let clientDomain = req.headers["api-clientDomain"];
  let password = req.headers["api-password"];

  if (!clientDomain) {
    return res.status(400).send({ message: "No domain provided!" });
  } else if (!password) {
    return res.status(403).send({ message: "No password provided!" });
  } else {
    Client.findOne({ clientDomain: clientDomain }, (err, client) => {
      if (err) {
        return res.status(500).send({ status: "error", message: err.message });
      } else if (!client) {
        return res
          .status(404)
          .send({ status: "error", message: "No cliend found" });
      } else {
        var passwordIsValid = bcrypt.compareSync(password, client.password);
        if (!passwordIsValid) {
          return res.status(401).send({
            status: "error",
            message: "Invalid Password",
          });
        }
        res.status(200).send({
          id: client._id,
          clientDomain: client.clientDomain,
          dbDomain: client.dbDomain,
          secret: client.secret,
        });
        next();
      }
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminOrModerator,
  isClient,
  isUser,
};
module.exports = authJwt;
