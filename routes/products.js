const express = require("express");
const ProductController = require("../controllers/products.controller");

const router = express.Router();

router.get("/get-inventory", ProductController.getInventory);
router.get("/get-orders", ProductController.getOrdersByDate);
router.get("/group-orders", ProductController.groupByDate);
router.get("/get-vouchers-by-date", ProductController.getVouchersByDate);

module.exports = router;
