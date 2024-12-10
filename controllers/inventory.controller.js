const Inventory1 = require("../models/Inventory");
const iPhones1 = require("../models/iPhones");
const iWatches1 = require("../models/iWatches");
const iPods1 = require("../models/iPods");

const iPhones2 = require("../models/iPhones2");
const iPods2 = require("../models/iPods2");
const iWatches2 = require("../models/iWatches2");
const Inventory2 = require("../models/Inventory2");

const mongoose = require("mongoose");

const getSchema = (alt, type) => {
  if (type === 1) {
    return alt ? iPhones2 : iPhones1;
  } else if (type === 2) {
    return alt ? iPods2 : iPods1;
  } else if (type === 3) {
    return alt ? iWatches2 : iWatches1;
  } else {
    alt ? Inventory2 : Inventory1;
  }
};

exports.addStock = async (req, res, next) => {
  if (!req.body) {
    const error = new Error("Error occured while trying to update stock!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  const alt = req.body.alt;
  let iPhones = getSchema(alt, 1),
    iPods = getSchema(alt, 2),
    iWatches = getSchema(alt, 3),
    Inventory = getSchema(alt, 4);

  const id = req.body.id;
  const variantId = req.body.variantId;

  let response, previous, prevQty;

  try {
    if (req.body.category === "iPhones") {
      previous = await iPhones.findOne({
        pid: req.body.pid,
        "variants._id": variantId,
      });

      prevQty = previous?.variants?.find((doc) => {
        return doc?._id?.toString() === variantId?.toString();
      });

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
      prevQty = await iPods.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });

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
      previous = await iWatches.findOne({
        pid: req.body.pid,
        "variants._id": variantId,
      });

      prevQty = previous?.variants?.find((doc) => {
        return doc?._id?.toString() === variantId?.toString();
      });

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

    const newInvtry = alt ? new Inventory2({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      add: req.body.add,
      prev: prevQty.quantity,
      reason: "stock-increased",
    }) : new Inventory1({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      add: req.body.add,
      prev: prevQty.quantity,
      reason: "stock-increased",
    });

    console.log(newInvtry);

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

  const alt = req.body.alt;
  let iPhones = getSchema(alt, 1),
    iPods = getSchema(alt, 2),
    iWatches = getSchema(alt, 3),
    Inventory = getSchema(alt, 4);

  let response, previous, prevQty;
  const id = req.body.id;
  const variantId = req.body.variantId;

  try {
    if (req.body.category === "iPhones") {
      previous = await iPhones.findOne({
        pid: req.body.pid,
        "variants._id": variantId,
      });

      prevQty = previous?.variants?.find((doc) => {
        return doc?._id?.toString() === variantId?.toString();
      });

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
      prevQty = await iPods.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      });

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
      previous = await iWatches.findOne({
        pid: req.body.pid,
        "variants._id": variantId,
      });

      prevQty = previous?.variants?.find((doc) => {
        return doc?._id?.toString() === variantId?.toString();
      });

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

    const newInvtry = alt ?  new Inventory2({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      sub: req.body.sub,
      prev: prevQty.quantity,
      reason: "stock-decreased",
    }) : new Inventory1({
      dateAdded: new Date(),
      pid: req.body.pid,
      name: req.body.name,
      desc: req.body.desc,
      sub: req.body.sub,
      prev: prevQty.quantity,
      reason: "stock-decreased",
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
  const alt = req.query.alt;
  let Inventory = getSchema(alt, 4);

  const gteDate = new Date(req.query.gte);
  const lteDate = new Date(req.query.lte);
  const adjLteDate = lteDate.setMilliseconds(86340000);

  let schema = alt ? Inventory2 : Invetory1

  schema.find({
    dateAdded: {
      $gte: gteDate,
      $lt: new Date(adjLteDate),
    },
  })
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
