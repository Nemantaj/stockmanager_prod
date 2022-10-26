const iPhones = require("../models/iPhones");
const iPods = require("../models/iPods");
const iWatches = require("../models/iWatches");
const mongoose = require("mongoose");
const db = mongoose.connection.db;
const Order = mongoose.model("Order", new mongoose.Schema(), "orders");

exports.getInventory = (req, res, next) => {
  let iphn, ipod;
  iPhones
    .find({})
    .then((result) => {
      iphn = result;
      return iPods.find({});
    })
    .then((result) => {
      ipod = result;
      return iWatches.find({});
    })
    .then((result) => {
      res.json({ iphones: iphn, ipods: ipod, iwatches: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getOrdersByDate = (req, res, next) => {
  const gteDate = req.query.gte;
  const lteDate = req.query.lte;

  if (!gteDate || !lteDate) {
    const error = new Error("Error occured while trying to retrieve orders!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Order.find({
    order_date: {
      $gte: new Date(gteDate),
      $lt: new Date(lteDate),
    },
  })
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

exports.groupByDate = (req, res, next) => {
  const gteDate = req.query.gte;
  const lteDate = req.query.lte;

  if (!gteDate || !lteDate) {
    const error = new Error("Error occured while trying to retrieve orders!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Order.aggregate([
    {
      $match: {
        order_date: {
          $gte: new Date(gteDate),
          $lt: new Date(lteDate),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
        orders: { $push: "$$ROOT" },
        total: { $sum: "$total" },
        products: { $sum: { $size: "$products1" } },
      },
    },
    { $sort: { _id: -1 } },
  ])
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
