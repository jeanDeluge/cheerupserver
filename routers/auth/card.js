const express = require("express");
const router = express.Router();
const cardController = require("../../Controller/cardController");

router.post("/create", cardController.create);

router.get("/get", cardController.get);

module.exports = router;
