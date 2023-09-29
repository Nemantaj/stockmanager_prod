const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expense = new Schema(
  {
    input: String,
    amount: Number,
    type: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SalePurchase", expense);
