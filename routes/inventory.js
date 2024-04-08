const InventoryController = require("../controllers/inventory.controller");
const authController = require("../controllers/auth.controller");
const products = require("../controllers/products");

const express = require("express");
const isAdmin = require("../utils/is-admin");
const router = express.Router();

router.post("/add-stock", isAdmin, InventoryController.addStock);
router.post("/sub-stock", isAdmin, InventoryController.subStock);
router.get("/get-history", isAdmin, InventoryController.getHistory);
router.post("/get-token", authController.getToken);
router.post("/add-product", isAdmin, products.addProduct);
router.post("/edit-product", isAdmin, products.editProduct);
router.post("/delete-product", isAdmin, products.deleteProduct);
router.post("/get-single-product", isAdmin, products.getSingleProduct);
router.get("/get-products", isAdmin, products.getProducts);

module.exports = router;
