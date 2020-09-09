const express = require("express");
const router = express.Router();
const commentController = require("../../Controller/commentController");

router.post("/create", commentController.create);

router.get("/get", commentController.get);

router.get("/getCheer", commentController.getCheer);

router.post("/update", commentController.update);

router.post("/delete", commentController.delete);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const cardController = require("../../Controller/cardController");

// router.post("/create", cardController.create);

// router.get("/get", cardController.get);

// router.get("/getAll", cardController.getAll);

// router.post("/update", cardController.update);

// router.post("/delete", cardController.delete);

// module.exports = router;
