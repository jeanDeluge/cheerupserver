const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");

router.post("/join", userController.join);


module.exports = router;