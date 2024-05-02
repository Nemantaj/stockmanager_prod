const mongoose = require("mongoose"),
  shortid = require("shortid");

var orderSchema = mongoose.Schema({
  oid: { type: Number, unique: true, sparse: true },
  total_paid: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  payments: [{ date: Date, amount: Number }],
  balance: Number,
  date_purchased: { type: String },
  username: String,
  mobile: Number,
  email: String,
  billName: String,
  add_1: String,
  add_2: String,
  city: String,
  state: String,
  pincode: Number,
  isPaid: { type: Boolean, default: false },
  order_date: { type: Date, default: Date.now },
  billno: Number,
  payment_type: String,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  loanComplete: { type: Boolean, default: false },
});

module.exports = mongoose.model("Loan", orderSchema);
