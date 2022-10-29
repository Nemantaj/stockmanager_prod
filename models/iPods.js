const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iPods = new Schema({
  name: { type: String },
  quantity: { type: Number },
  isInStock: { type: Boolean, default: false },
  price: { type: Number },
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
});

module.exports = mongoose.model("iPod", iPods);
