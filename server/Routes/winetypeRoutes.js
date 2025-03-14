const express = require("express");
const router = express.Router();
const winetypeController = require("../controller//WinetypeController");

// Routes
router.get("/", winetypeController.getWineTypes);
router.post("/", winetypeController.createWineType);


module.exports = router;