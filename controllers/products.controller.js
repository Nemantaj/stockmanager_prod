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
  const gteDate = new Date(req.query.gte);
  const lteDate = new Date(req.query.lte);
  const adjLteDate = lteDate.setMilliseconds(86340000);

  if (!gteDate || !lteDate) {
    const error = new Error("Error occured while trying to retrieve orders!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Order.find({
    order_date: {
      $gte: gteDate,
      $lt: new Date(adjLteDate),
    },
    isPaid: true
  })
    .sort({ order_date: 1 })
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
  const gteDate = new Date(req.query.gte);
  const lteDate = new Date(req.query.lte);
  const adjLteDate = lteDate.setMilliseconds(86340000);

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
          $gte: gteDate,
          $lt: new Date(adjLteDate),
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
  const gteDate = new Date(req.query.gte);
  const lteDate = new Date(req.query.lte);
  const adjLteDate = lteDate.setMilliseconds(86340000);

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
          $gte: gteDate,
          $lt: new Date(adjLteDate),
        },
      },
    },
    { $group: { _id: "$date", data: { $push: "$$ROOT" } } },
  ])
    .sort({ _id: 1 })
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

exports.getProductsByDate = (req, res, next) => {
  const gteDate = new Date(req.query.gte);
  const lteDate = new Date(req.query.lte);
  const adjLteDate = lteDate.setMilliseconds(86340000);

  if (!gteDate || !lteDate) {
    const error = new Error("Error occured while trying to retrieve orders!.");
    error.title = "Error Occured";
    error.statusCode = 422;
    throw error;
  }

  Order.aggregate([
    {
      $match: {
        isPaid: true, order_date: {
          $gte: gteDate,
          $lt: new Date(adjLteDate),
        }
      },
    },
    { $unwind: '$products1' },
    { $group: { _id: { id: '$products1.product_id', name: '$products1.name', variants: '$products1.desc', }, orders: { $sum: 1 }, total_value: { $sum: '$products1.price' }, total_quantity: { $sum: '$products1.quantity' }, type: { $first: '$products1.product' } } },
  ]).then(result => {
    let newData = result;
    if (newData.length > 0) {
      newData = result.map(doc => {
        let productType;
        if (doc.type === '1') {
          productType = "iPhone"
        } else if (doc.type === "2") {
          productType = "Watch"
        } else {
          productType = "AirPods"
        }
        return {
          id: doc._id.id,
          name: doc._id.name,
          variant: doc._id.variants,
          totalOrders: doc.orders,
          totalValue: doc.total_value,
          totalQuantity: doc.total_quantity,
          type: productType
        }
      }).sort((a, b) => {
        let fa = a.name.toLowerCase();

        let fb = b.name.toLowerCase()

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
    }
    res.json(newData);
  }).catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}
