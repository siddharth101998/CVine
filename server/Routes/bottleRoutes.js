const express = require("express");
const router = express.Router();
const bottleController = require("../controller/BottleController");

// Routes
router.get("/", bottleController.getAllBottles);
router.get("/trending", bottleController.getTrending); // moved up
router.get("/search", bottleController.searchbottle);
router.get('/top', bottleController.getTopViewedBottles) // moved up
router.get("/:id", bottleController.getBottleById);
router.post("/", bottleController.addBottle);
router.delete("/:id", bottleController.deleteBottle);

module.exports = router;