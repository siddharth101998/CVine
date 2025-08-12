const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

// Routes

router.post("/login", UserController.loginUser)

router.get("/:id", UserController.getUserProfile)
router.post("/", UserController.createUser);
router.put("/:id", UserController.updateUser)
// router.put("/logcount/:id", UserController.incrementLoginCount)




module.exports = router;