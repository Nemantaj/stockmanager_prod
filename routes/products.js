const express = require("express");
const ProductController = require("../controllers/products.controller");
const isAdmin = require("../utils/is-admin");

const router = express.Router();

router.get("/get-inventory", isAdmin, ProductController.getInventory);
router.get("/get-orders", isAdmin, ProductController.getOrdersByDate);
router.get("/group-orders", isAdmin, ProductController.groupByDate);
router.get(
  "/get-vouchers-by-date",
  isAdmin,
  ProductController.getVouchersByDate
);
router.get(
  "/get-products-by-date",
  isAdmin,
  ProductController.getProductsByDate
);

module.exports = router;
