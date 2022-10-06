const db = require("../models");
const User = db.user;
const Trasnaction = db.transaction;
const Chrome = db.chrome;
const geolib = require("geolib");

exports.userController = {
  addChrome: async (req, res) => {
    try {
      const chrome = await Chrome.findById(req.params.chromeId);
      if (!chrome) {
        return res.status(404).json({
          status: "error",
          message: "chrome does not exist",
        });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user could not be found",
        });
      }
      if (user.chromes.includes(req.params.chromeId)) {
        let exists = false;
        for (let i = 0; i < user.repeated.length; i++) {
          if (user.repeated[i].chrome == req.params.chromeId) {
            await User.findByIdAndUpdate(req.params.userId, { $inc: { "repeated.$[index].quantity": 1 } }, { arrayFilters: [{ "index.chrome": req.params.chromeId }] });
            exists = true;
          }
        }
        if (!exists) {
          await User.findByIdAndUpdate(req.params.userId, {
            $push: {
              repeated: {
                chrome: req.params.chromeId,
                quantity: 1,
              },
            },
          });
        }
      } else {
        await User.findByIdAndUpdate(req.params.userId, { $push: { chromes: req.params.chromeId } });
      }
      const updatedUser = await User.findById(req.params.userId, "-password");
      return res.status(200).json({
        status: "success",
        message: "chrome added to user collection",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  removeChrome: async (req, res) => {
    try {
      const chrome = await Chrome.findById(req.params.chromeId);
      if (!chrome) {
        return res.status(404).json({
          status: "error",
          message: "chrome does not exist",
        });
      }
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "user could not be found",
        });
      }
      for (let i = 0; i < user.repeated.length; i++) {
        if (user.repeated[i].chrome == req.params.chromeId) {
          const updated = await User.findByIdAndUpdate(req.params.userId, { $inc: { "repeated.$[index].quantity": -1 } }, { arrayFilters: [{ "index.chrome": req.params.chromeId }] });
          if (updated.repeated[i].quantity === 1) {
            await User.findByIdAndUpdate(req.params.userId, { $pull: { repeated: { chrome: req.params.chromeId } } });
          }
        }
      }
      const updatedUser = await User.findById(req.params.userId, "-password");
      return res.status(200).json({
        status: "success",
        message: "chrome added to user collection",
        user: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  count: async (req, res) => {
    try {
      const count = await User.count();
      return res.status(200).json({
        status: "success",
        usersCount: count,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  userChromesCount: async (req, res) => {
    try {
      const users = await User.find();
      let chromes = 0;
      let repeatedChromes = 0;
      users.map((user) => {
        const userChromes = user.chromes.length;
        let userRepeated = 0;
        user.repeated.map((repeat) => {
          userRepeated = userRepeated + repeat.quantity;
        });
        chromes = chromes + userChromes;
        repeatedChromes = repeatedChromes + userRepeated;
      });
      return res.status(200).json({
        status: "success",
        chromes: chromes,
        repeated: repeatedChromes,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.find({}, "-password")
        .populate([
          {
            path: "roles",
          },
        ])
        .lean();
      res.status(200).json({
        status: "success",
        users: users,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  setLocation: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { location: { lat: req.body.lat, lng: req.body.lng } });
      return res.status(200).json({
        status: "success",
        message: "user's location updated",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getNearestUsers: async (req, res) => {
    try {
      const mainUser = await User.findByIdAndUpdate(req.params.id, {
        location: {
          lat: req.body.lat,
          lng: req.body.lng,
        }
      }, {new: true});

      const users = await User.find({}, "username repeated location transactions").populate([
        {
          path: "repeated",
          populate: {
            path: "chrome",
          },
        },
        {
          path: "transactions",
          select: "from to userRates",
        },
      ]);

      const nearest = [];

      users.map((user, i) => {
        if (user._id != req.params.id && user.location.lat) {
          console.log([mainUser.location, user.location]);
          const distance = geolib.getDistance(
            {
              lat: mainUser.location.lat,
              lng: mainUser.location.lng,
            },
            {
              lat: user.location.lat,
              lng: user.location.lng,
            }
          );

          if (distance < req.params.distance) {
            const rates = [];
            user.transactions.map((trans, i) => {
              return trans.from.toString() === user._id.toString() && trans.userRates.offerer.rate
                ? rates.push(trans.userRates.offerer.rate)
                : trans.to.toString() === user._id.toString() && trans.userRates.recipiant.rate && rates.push(trans.userRates.recipiant.rate);
            });
            const rating = rates.reduce((partialSum, a) => partialSum + a, 0) / rates.length;
            nearest.push({
              _id: user._id,
              username: user.username,
              repeated: user.repeated,
              distance: distance,
              rating: rating,
              transactions: user.transactions.length,
            });
          }
        }

        return;
      });

      return res.status(200).json({
        status: "success",
        users: nearest,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getRepeated: async (req, res) => {
    try {
      const user = await User.findById(req.params.id, "repeated").populate([
        {
          path: "repeated",
          populate: {
            path: "chrome",
          },
        },
      ]);
      const repeated = user.repeated;
      return res.status(200).json({
        status: "success",
        repeated: repeated,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  getOne: async (req, res) => {
    try {
      const user = await User.findById(req.params.id, "-password")
        .populate([
          {
            path: "roles",
          },
        ])
        .lean();

      return res.status(200).json({
        status: "success",
        user: user,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
