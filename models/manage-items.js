const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    pid: { type: Schema.Types.ObjectId, refPath: "schema" },
    vid: Schema.Types.ObjectId,
    productType: String,
    schema: String,
    order: Number,
    name: String,
    link: String,
    variant: String,
    price: { type: Number },
    quantity: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ManageItems", schema);
