const Inventory = require("../models/Inventory");
const iPhones = require("../models/iPhones");
const iWatches = require("../models/iWatches");
const iPods = require("../models/iPods");
const mongoose = require("mongoose");

exports.addStock = async (req, res, next) => {
  if (!req.body) {
    const error = new Error("Error occured while trying to update stock!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  const id = req.body.id;
  const variantId = req.body.variantId;

  let response;

  try {
    if (req.body.category === "iPhones") {
      response = await iPhones.findOneAndUpdate(
        {
          pid: req.body.pid,
          "variants._id": variantId,
        },
        {
          $inc: {
            "variants.$.quantity": req.body.add,
          },
        },
        { new: true }
      );
    } else if (req.body.category === "AirPods") {
      response = await iPods.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        {
          $inc: {
            quantity: req.body.add,
          },
        },
        { new: true }
      );
    } else {
      response = await iWatches.findOneAndUpdate(
        {
          pid: req.body.pid,
          "variants._id": variantId,
        },
        {
          $inc: {
            "variants.$.quantity": req.body.add,
          },
        },
        { new: true }
      );
    }

    const newInvtry = new Inventory({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      add: req.body.add,
    });

    await newInvtry.save();
    res.json({ response, category: req.body.category });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.subStock = async (req, res, next) => {
  if (!req.body) {
    const error = new Error("Error occured while trying to update stock!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  let response;
  const id = req.body.id;
  const variantId = req.body.variantId;

  try {
    if (req.body.category === "iPhones") {
      response = await iPhones.findOneAndUpdate(
        {
          pid: req.body.pid,
          "variants._id": variantId,
        },
        {
          $inc: {
            "variants.$.quantity": req.body.sub,
          },
        },
        { new: true }
      );
    } else if (req.body.category === "AirPods") {
      response = await iPods.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.id) },
        {
          $inc: {
            quantity: req.body.sub,
          },
        },
        { new: true }
      );
    } else {
      response = await iWatches.findOneAndUpdate(
        {
          pid: req.body.pid,
          "variants._id": variantId,
        },
        {
          $inc: {
            "variants.$.quantity": req.body.sub,
          },
        },
        { new: true }
      );
    }

    const newInvtry = new Inventory({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      sub: req.body.sub,
    });

    await newInvtry.save();
    res.json({ response, category: req.body.category });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getHistory = (req, res, next) => {
  Inventory.find({})
    .sort({ dateAdded: -1 })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
