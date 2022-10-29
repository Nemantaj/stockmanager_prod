const iPhones = require("../models/iPhones");
const iPods = require("../models/iPods");
const iWatches = require("../models/iWatches");
const mongoose = require("mongoose");
const db = mongoose.connection.db;
const Order = mongoose.model("Order", new mongoose.Schema(), "orders");
const Voucher = mongoose.model(
  "Vouchertable",
  new mongoose.Schema(),
  "vouchertables"
);

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
    .sort({ order_date: -1 })
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
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
        orders: { $push: "$$ROOT" },
        total: { $sum: "$total" },
        products: { $sum: { $size: "$products1" } },
        cash: {
          $sum: { $cond: [{ $eq: ["$payment_type", "Cash"] }, "$total", 0] },
        },
        online: {
          $sum: {
            $cond: [{ $eq: ["$payment_type", "Online"] }, "$total", 0],
          },
        },
        card: {
          $sum: { $cond: [{ $eq: ["$payment_type", "Card"] }, "$total", 0] },
        },
        cashfree: {
          $sum: {
            $cond: [{ $eq: ["$payment_type", "Cashfree"] }, "$total", 0],
          },
        },
        other: {
          $sum: { $cond: [{ $eq: ["$payment_type", "Other"] }, "$total", 0] },
        },
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

exports.getVouchersByDate = (req, res, next) => {
  const gteDate = req.query.gte;
  const lteDate = req.query.lte;

  if (!gteDate || !lteDate) {
    const error = new Error("Error occured while trying to retrieve orders!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Voucher.aggregate([
    {
      $addFields: {
        date: { $dateFromString: { dateString: "$date", format: "%d-%m-%Y" } },
      },
    },
    {
      $match: {
        date: {
          $gte: new Date(gteDate),
          $lt: new Date(lteDate),
        },
      },
    },
    { $group: { _id: "$date", data: { $push: "$$ROOT" } } },
  ])
    .then((result) => {
      if (result.length < 1) {
        return res.json([]);
      }
      const newResult = result
        .map((docMain) => {
          return docMain.data
            .map((doc) => {
              return doc.detail.map((subDoc) => {
                let product;
                if (subDoc.product === "1") {
                  product = "iPhone";
                } else if (subDoc.product === "2") {
                  product = "Watch";
                } else {
                  product = "AirPods";
                }
                return {
                  Date: doc.date.toString().slice(0, 10),
                  VDate: subDoc.date,
                  Name: subDoc.name,
                  City: subDoc.city,
                  Product: product,
                  Qty: subDoc.quantity,

                  Discount: subDoc.discount,
                  Ctpin: subDoc.ctipin,
                };
              });
            })
            .flat();
        })
        .flat();

      res.json(newResult);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
