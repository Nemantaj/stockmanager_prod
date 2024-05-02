const iPhones = require("../models/iPhones");
const iPods = require("../models/iPods");
const iWatches = require("../models/iWatches");

exports.addProduct = async (req, res, next) => {
  try {
    const { type, basic, variants } = req.body;
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
    const { type, basic, variants, id } = req.body;
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
    const { id, type } = req.body;
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
    const { id, type } = req.body;

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

const iPhones = require("../models/iPhones");
const iPods = require("../models/iPods");
const iWatches = require("../models/iWatches");

exports.addProduct = async (req, res, next) => {
  try {
    const { type, basic, variants } = req.body;
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
    const { type, basic, variants, id } = req.body;
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
    const { id, type } = req.body;
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
    const { id, type } = req.body;

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
