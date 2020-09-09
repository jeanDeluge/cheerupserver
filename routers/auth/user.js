const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");
const authMiddleware = require("../../Controller/authmiddleware")
router.post("/join", userController.join);

router.post("/login", userController.login);
router.get("/check", userController.check);
router.use("/",authMiddleware);
router.post("/logout", userController.logout);
//router.post("/joinout", userController.joinOut);

module.exports = router;
