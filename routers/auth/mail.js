const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");
const userAuthMail = require("../../Controller/userAuthMail");
//회원가입 확인 이메일
//router.post("/joinMail", userAuthMail.sendingJoinMail);
router.post("/confirmmail",userController.confirmMail);
router.post("/sendreset", userAuthMail.sendResetmessage );
router.post("/resetPassword", userAuthMail.resetPassword);
module.exports= router;
