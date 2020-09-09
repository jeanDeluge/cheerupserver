const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");

//회원가입 확인 이메일
//router.post("/joinMail", userAuthMail.sendingJoinMail);

router.post("/confirmmail",userController.confirmMail)
module.exports= router;