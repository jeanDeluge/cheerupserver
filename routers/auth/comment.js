const express = require("express");
const router = express.Router();
const commentController = require("../../Controller/commentController");

//comment table CREATE
router.post("/create", commentController.create);
//comment table GET
router.get("/get", commentController.get);
//comment table GET => 로그인한 유저가 작성한 모든 comment
router.get("/getMyComment", commentController.getMyComment);
//comment table GET => 로그인한 유저가 작성한 댓글들, join with Card Table.
router.get("/getCheer", commentController.getCheer);
//comment column udpate
router.post("/update", commentController.update);
//comment column delete
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
