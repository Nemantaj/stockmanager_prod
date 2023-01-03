const InventoryController = require("../controllers/inventory.controller");
const authController = require("../controllers/auth.controller");

const express = require("express");
const isAdmin = require("../utils/is-admin");
const router = express.Router();

router.post("/add-stock", isAdmin, InventoryController.addStock);
router.post("/sub-stock", isAdmin, InventoryController.subStock);
router.get("/get-history", isAdmin, InventoryController.getHistory);
router.post("/get-token", authController.getToken);

module.exports = router;
