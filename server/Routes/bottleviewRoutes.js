const express = require("express");
const router = express.Router();
const bottleviewController = require("../controller/BottleViewController");

// Routes
router.get("/:id", bottleviewController.getUserSearchHistory)
router.get("/favourites/:id", bottleviewController.getTopBottlesForUser);
router.post("/", bottleviewController.updateBottleView);


module.exports = router;