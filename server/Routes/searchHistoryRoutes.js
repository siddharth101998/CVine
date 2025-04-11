const express = require("express");
const router = express.Router();
const {
    gethistory, addhistory
} = require("../controller//searchHistoryController");

// Routes
router.get("/:id", gethistory);
router.post("/", addhistory);


module.exports = router;