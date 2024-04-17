const express = require("express");
const ProductController = require("../controllers/products.controller");
const isAdmin = require("../utils/is-admin");

const router = express.Router();

router.get("/get-inventory", isAdmin, ProductController.getInventory);
router.get("/get-orders", isAdmin, ProductController.getOrdersByDate);
router.get("/get-udhars", isAdmin, ProductController.getUdharByDate);
router.get("/get-single-udhar/:billno", ProductController.getSingleUdhar);
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
router.get("/get-pdf-data/:date", isAdmin, ProductController.getPdfData);
router.post("/print-pdf", isAdmin, ProductController.printPDF);
router.get("/clear", isAdmin, ProductController.clear);
router.post("/get-stocks", isAdmin, ProductController.getStocks);
router.post("/mark-loan-complete", ProductController.markLoanComplete);
router.get("/get-all-stocks", isAdmin, ProductController.getAllStocks);
router.post("/create-record", isAdmin, ProductController.createRecord);

module.exports = router;
