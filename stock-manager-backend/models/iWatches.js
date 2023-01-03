const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iWatches = new Schema({
  name: { type: String },
  link: { type: String },
  short_desc: { type: String },
  pid: { type: String },
  gallery: [
    {
      url: { type: String },
      public_id: { type: String },
    },
  ],
  desc_images: [],
  variants: [
    {
      size: { type: String },
      type: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      isInStock: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("iWatch", iWatches);
