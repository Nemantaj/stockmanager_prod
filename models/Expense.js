const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expense = new Schema(
  {
    name: String,
    amount: Number,
    reason: String,
    cleared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expense);
