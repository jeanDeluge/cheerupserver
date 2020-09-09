const router = require("express").Router();
const userController = require("../Controller/userController");
const user = require("./auth/user");
const mail = require("./auth/mail");

//이건 미들웨어를만든 것.로그인 항상 가능한 상태로 만들기 위함
router.use("/user", user);
router.use("/user", userController.check);

module.exports = router;
