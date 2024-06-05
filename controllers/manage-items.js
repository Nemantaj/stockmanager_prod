const ManageItems = require("../models/manage-items");
const iPhones = require("../models/iPhones");
const iPods = require("../models/iPods");
const iWatches = require("../models/iWatches");

exports.syncModels = async (req, res, next) => {
  try {
    const iphones = await iPhones.find({}).lean();

    const iphoneIds = [],
      altIphones = [];

    //register regex
    const regexIp = new RegExp("iphone", "i"),
      regexId = new RegExp("ipad", "i");

    iphones.forEach((doc) => {
      doc.variants.forEach((d) => {
        iphoneIds.push(d._id);

        altIphones.push({
          pid: doc._id,
          vid: d?._id,
          productType: regexIp?.test(doc.name)
            ? "iPhone"
            : regexId?.test(doc?.name)
            ? "iPad"
            : "Android",
          schema: "Iphone",
          name: doc?.name,
          link: doc.link,
          variant: d?.storage,
          quantity: d?.quantity,
        });
      });
    });

    //remove deleted items
    await ManageItems.deleteMany({
      schema: "Iphone",
      vid: { $nin: iphoneIds },
    });

    //store promises
    let promises = [];

    //update items
    let list = altIphones.map((doc) =>
      ManageItems.findOneAndUpdate(
        { pid: doc.pid, vid: doc.vid },
        { $set: { ...doc }, $setOnInsert: { order: 600, price: 0 } },
        { upsert: true }
      )
    );

    promises = [...list];

    const iwatches = await iWatches.find({}).lean();

    const iwatchIds = [],
      altIWatchs = [];

    iwatches.forEach((doc) => {
      doc.variants.forEach((d) => {
        iwatchIds.push(d._id);

        altIWatchs.push({
          pid: doc._id,
          vid: d?._id,
          productType: "iWatch",
          schema: "Iwatch",
          name: doc?.name,
          link: doc.link,
          variant: `${d.size} ${d.type}`,
          quantity: d?.quantity,
        });
      });
    });

    //remove deleted items
    await ManageItems.deleteMany({
      schema: "Iwatch",
      vid: { $nin: iwatchIds },
    });

    //update items
    list = altIWatchs.map((doc) =>
      ManageItems.findOneAndUpdate(
        { pid: doc.pid, vid: doc.vid },
        { $set: { ...doc }, $setOnInsert: { order: 600, price: 0 } },
        { upsert: true }
      )
    );

    promises = [...promises, ...list];

    const ipods = await iPods.find({}).lean();

    const ipodIds = [],
      altIpods = [];

    ipods.forEach((doc) => {
      ipodIds.push(doc._id);

      altIpods.push({
        pid: doc._id,
        productType: "Airpods",
        schema: "Ipod",
        name: doc?.name,
        link: doc.link,
        variant: `default`,
        quantity: doc?.quantity,
      });
    });

    //remove deleted items
    await ManageItems.deleteMany({ schema: "Ipod", pid: { $nin: ipodIds } });

    //update items
    list = altIpods.map((doc) =>
      ManageItems.findOneAndUpdate(
        { pid: doc.pid, variant: doc.variant },
        { $set: { ...doc }, $setOnInsert: { order: 600, price: 0 } },
        { upsert: true }
      )
    );

    promises = [...promises, ...list];
    await Promise.all(promises);

    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const doc = req.body;
    let newDoc = new ManageItems(doc);

    await newDoc.save();
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getItems = async (req, res, next) => {
  try {
    let items = await ManageItems.find({}).lean();
    let groupedItems = {
      iphones: [],
      ipads: [],
      androids: [],
      iwatches: [],
      airpods: [],
    };

    items.forEach((doc) => {
      if (doc.productType === "iPhone") {
        groupedItems.iphones.push(doc);
      } else if (doc.productType === "iPad") {
        groupedItems.ipads.push(doc);
      } else if (doc.productType === "Android") {
        groupedItems.androids.push(doc);
      } else if (doc.productType === "iWatch") {
        groupedItems.iwatches.push(doc);
      } else {
        groupedItems.airpods.push(doc);
      }
    });

    groupedItems.iphones = groupedItems.iphones?.sort(
      (a, b) => a.order - b.order
    );
    groupedItems.androids = groupedItems.androids?.sort(
      (a, b) => a.order - b.order
    );
    groupedItems.ipads = groupedItems.ipads?.sort((a, b) => a.order - b.order);
    groupedItems.iwatches = groupedItems.iwatches?.sort(
      (a, b) => a.order - b.order
    );
    groupedItems.airpods = groupedItems.airpods?.sort(
      (a, b) => a.order - b.order
    );

    return res.json({ items: groupedItems, success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getItems2 = async (req, res, next) => {
  try {
    let items = await ManageItems.find({}).lean();
    let groupedItems = {
      iphones: [],
      ipads: [],
      androids: [],
      iwatches: [],
      airpods: [],
    };

    items.forEach((doc) => {
      if (doc?.price > 0) {
        if (doc.productType === "iPhone") {
          groupedItems.iphones.push(doc);
        } else if (doc.productType === "iPad") {
          groupedItems.ipads.push(doc);
        } else if (doc.productType === "Android") {
          groupedItems.androids.push(doc);
        } else if (doc.productType === "iWatch") {
          groupedItems.iwatches.push(doc);
        } else {
          groupedItems.airpods.push(doc);
        }
      }
    });

    return res.json({ items: groupedItems, success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editPrice = async (req, res, next) => {
  try {
    let { id, doc } = req.body;
    await ManageItems.findByIdAndUpdate(id, { $set: { ...doc } });
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editOrder = async (req, res, next) => {
  try {
    let { arr } = req.body;
    const promises = arr.map((doc) =>
      ManageItems.findByIdAndUpdate(doc._id, { $set: { order: doc.order } })
    );

    await Promise.all(promises);
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createClone = async (req, res, next) => {
  try {
    const { _id, name } = req.body;

    const productToClone = await ManageItems.findById(_id).lean();
    delete productToClone._id;
    const newDoc = new ManageItems({
      ...productToClone,
      isClone: true,
      cloneSuffix: `${name}`,
    });

    await newDoc.save();
    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const id = req.params.id;

    await ManageItems.findByIdAndRemove(id);

    return res.json({ success: true });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
