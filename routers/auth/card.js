const express = require("express");
const router = express.Router();
const cardController = require("../../Controller/cardController");

router.post("/create", cardController.create);

router.get("/get", cardController.get);

router.post("/update", cardController.update);

router.post("/delete", cardController.delete);

module.exports = router;
