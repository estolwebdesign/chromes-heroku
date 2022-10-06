const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const dbConfig = require("../config/db.config");
const db = require("../models");
const Role = db.role;
const PORT = process.env.PORT || 8080;
const socket = require("socket.io");

db.mongoose
  .connect(`mongodb+srv://estol1991:rominola1995@cluster0.15o6vqz.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log("succesfully connected to DB");
    initial();
  })
  .catch((err) => {
    console.log("error on DB connection", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log(`added "user" to roles collection`);
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log(`added "moderator" to roles collection`);
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log(`added "admin" to roles collection`);
      });
    }
  });
}

const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'https://chromeswap.herokuapp.com', 'https://8080-cs-520734283367-default.cs-us-east1-pkhd.cloudshell.dev']

var corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

const path = require('path');
// if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTING
require("../routes/auth.routes")(app);
require("../routes/chromes.routes")(app);
require("../routes/transactions.routes")(app);
require("../routes/admin.transactions.routes")(app);

const server = app.listen(PORT, () => {
  console.log(`server runing on "http://localhost:${PORT}"`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiver._id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("response", data.messageObj);
    }
  });
});
