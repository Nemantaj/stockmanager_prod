const InventoryController = require("../controllers/inventory.controller");
const express = require("express");
const router = express.Router();

router.post("/add-stock", InventoryController.addStock);
router.post("/sub-stock", InventoryController.subStock);
router.get("/get-history", InventoryController.getHistory);

module.exports = router;
