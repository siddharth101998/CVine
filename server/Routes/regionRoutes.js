const express = require("express");
const router = express.Router();
const regionController = require("../controller/WineregionController");

// Routes
router.get("/", regionController.getWineRegions);
router.post("/", regionController.createWineRegion);


module.exports = router;