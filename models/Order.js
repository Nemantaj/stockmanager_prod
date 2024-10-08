var mongoose = require("mongoose"),
  shortid = require("shortid");
var orderSchema = mongoose.Schema({
  oid: { type: Number, unique: true, sparse: true },
  isOnline: { type: Boolean, default: true },
  products: [],
  products1: [
    {
      product_id: String,
      name: String,
      desc: String,
      quantity: Number,
      vou: Number,
      product: String,
      details: String,
      price: Number,
      my_price: Number,
      ctpin: Number,
      isRegistered: { type: Boolean, default: false },
    },
  ],
  tax: Number,
  total_paid: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  date_purchased: { type: String },
  dispatch_date: { type: String },
  tracking_company: String,
  tracking_id: String,
  tracking_link: String,
  order_progress: String,
  status: String,
  paid_struc: {
    cash: Number,
    card: Number,
    bank: Number,
    loaned: Number,
  },
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
  advance: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  order_note: String,
  isLoan: { type: Boolean, default: false },
});

module.exports = mongoose.model("Order", orderSchema);
