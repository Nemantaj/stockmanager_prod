const iPhones1 = require("../models/iPhones");
const iWatches1 = require("../models/iWatches");
const iPods1 = require("../models/iPods");

const iPhones2 = require("../models/iPhones2");
const iPods2 = require("../models/iPods2");
const iWatches2 = require("../models/iWatches2");

const getSchema = (alt, type) => {
  if (type === 1) {
    return alt ? iPhones2 : iPhones1;
  } else if (type === 2) {
    return alt ? iPods2 : iPods1;
  } else {
    return alt ? iWatches2 : iWatches1;
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const { type, basic, variants, alt } = req.body;

    let iPhones = getSchema(alt, 1),
      iPods = getSchema(alt, 2),
      iWatches = getSchema(alt, 3);

    let Schema =
      type === "iPhone" ? iPhones : type === "iPod" ? iPods : iWatches;

    let doc = new Schema({
      ...basic,
      variants: variants,
    });

    await doc.save();
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const { type, basic, variants, id, alt } = req.body;

    let iPhones = getSchema(alt, 1),
      iPods = getSchema(alt, 2),
      iWatches = getSchema(alt, 3);

    let Schema =
      type === "iPhone" ? iPhones : type === "iPod" ? iPods : iWatches;

    await Schema.findByIdAndUpdate(id, {
      $set: type === "iPod" ? { ...basic } : { ...basic, variants: variants },
    });

    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id, type, alt } = req.body;

    let iPhones = getSchema(alt, 1),
      iPods = getSchema(alt, 2),
      iWatches = getSchema(alt, 3);

    let Schema =
      type === "iPhone" ? iPhones : type === "iPod" ? iPods : iWatches;

    await Schema.findByIdAndRemove(id);
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const alt = req.query.alt;

    let iPhones = getSchema(alt, 1),
      iPods = getSchema(alt, 2),
      iWatches = getSchema(alt, 3);

    let iphones = await iPhones.find({}).lean();
    let ipods = await iPods.find({}).lean();
    let iwatches = await iWatches.find({}).lean();

    iphones = iphones.map((doc) => {
      return { ...doc, type: "iPhone" };
    });
    ipods = ipods.map((doc) => {
      return { ...doc, type: "iPod" };
    });
    iwatches = iwatches.map((doc) => {
      return { ...doc, type: "iWatch" };
    });

    return res.json({ items: [...iphones, ...ipods, ...iwatches] });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const { id, type, alt } = req.body;

    let iPhones = getSchema(alt, 1),
      iPods = getSchema(alt, 2),
      iWatches = getSchema(alt, 3);

    let Schema =
      type === "iPhone" ? iPhones : type === "iPod" ? iPods : iWatches;

    const item = await Schema.findById(id).lean();
    return res.json({ item });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
