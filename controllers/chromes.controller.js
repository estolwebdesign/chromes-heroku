const db = require("../models");
const Chrome = db.chrome;

exports.chromesController = {
  create: async (req, res) => {
    try {
      const newChrome = await Chrome.create(req.body);
      if (!newChrome) {
        return res.status(400).json({
          status: "error",
          message: "chrome could not be created",
        });
      }
      return res.status(201).json({
        status: "success",
        message: "chrome was created",
        chrome: newChrome,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const deletedChrome = await Chrome.findByIdAndRemove(req.params.id);
      if (!deletedChrome) {
        return res.status(400).json({
          status: "error",
          message: "chrome could not be deleted",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "chrome was removed",
        chrome: deletedChrome,
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
      const allChromes = await Chrome.find();
      if (!allChromes || allChromes.length < 1) {
        return res.status(404).json({
          status: "error",
          message: "no chromes could be found",
        });
      }
      return res.status(200).json({
        status: "success",
        chromes: allChromes,
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
      const chrome = await Chrome.findById(req.params.id);
      if (!chrome) {
        return res.status(404).json({
          status: "error",
          message: "no chromes could be found",
        });
      }
      return res.status(200).json({
        status: "success",
        chrome: chrome,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  search: async (req, res) => {
    try {
      const str = req.params.searchStr;
      const chromes = await Chrome.find({ $or: [{ name: str }, { player: str }] });
      if (!chromes || chrome.length < 1) {
        return res.status(404).json({
          status: "error",
          message: "no chromes could be found",
        });
      }
      return res.status(200).json({
        status: "success",
        chromes: chromes,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const updatedChrome = await Chrome.findByIdAndUpdate(req.body);
      if (!updatedChrome) {
        return res.status(400).json({
          status: "error",
          message: "chrome could not be updated",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "chrome was updated",
        chrome: updatedChrome,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },

  createAll: async (req, res) => {
    try {
      const chromes = [];
      const teamFlags = ["QAT", "ECU", "SEN", "NED", "ENG", "IRN", "USA", "WAL", "ARG", "KSA", "MEX", "POL", "FRA", "AUS", "DEN", "TUN", "ESP", "CRC", "GER", "JPN", "BEL", "CAN", "MAR", "CRO", "BRA", "SRB", "SUI", "CMR", "POR", "GHA", "URU", "KOR"];
      const teams = ["Qatar", "Ecuador", "Senegal", "Netherlands", "England", "Ir Irán", "USA", "Wales", "Argentina", "Saudi Arabia", "Mexico", "Poland", "France", "Australia", "Denmark", "Tunisia", "Spain", "Costa Rica", "Germany", "Japan", "Belgium", "Canada", "Morocco", "Croatia", "Brazil", "Serbia", "Switzerland", "Cameroon", "Portugal", "Ghana", "Uruguay", "Korea Republic"];
      chromes.push({
        section: "FWC1",
        name: `00`,
      });
      for (let i = 1; i < 19; i++) {
        const chrome = {
          section: "FWC1",
          name: `FWC ${i}`,
        };
        chromes.push(chrome);
      }
      for (let team = 0; team < 32; team++) {
        for (let i = 1; i < 20; i++) {
          const chrome = {
            number: 
            section: `${teams[team]}`,
            name: `${teamFlags[team]} ${i}` 
          };
          chromes.push(chrome);
        }
      }
      for (let i = 19; i < 30; i++) {
        const chrome = {
          section: "FWC2",
          name: `FWC ${i}`,
        };
        chromes.push(chrome);
      }
      await Chrome.insertMany(chromes);
      return res.status(201).json({
        status: "success",
        message: `${chromes.length} chromes created`,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};
