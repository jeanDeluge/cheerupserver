const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");

router.post("/join", userController.join);
router.post("/login/", userController.login)
router.post("/login/:userId", userController.check)


module.exports = router;