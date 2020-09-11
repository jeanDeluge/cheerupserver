const router = require("express").Router();
const userController = require("../Controller/userController");
const user = require("./auth/user");
const mail = require("./auth/mail");

router.use("/user", user);
router.use("/", userController.check);
router.use('/mail', mail)

module.exports = router;
