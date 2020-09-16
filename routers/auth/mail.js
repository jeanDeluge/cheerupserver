const express = require("express");
const router = express.Router();
const userController = require("../../Controller/userController");
const userAuthMail = require("../../Controller/userAuthMail");
//회원가입 확인 이메일
//router.post("/joinMail", userAuthMail.sendingJoinMail);
router.post("/confirmmail",userController.confirmMail);
// /mail/sendreset => 이메일입력시 비밀번호 찾기를 위한 이메일보내는것
// /mail/resetpassword => 이메일에 동봉된 링크를 클릭시 이동하는 '비밀번호 재설정 페이지' 에서 '비밀번호 => 바디로 보내면' 실행하는 엔드포인트
router.post("/sendreset", userAuthMail.sendResetmessage ); //토큰 만들기, 만든토큰은 db저장, 토큰을 url같이 이메일에 보냄
router.post("/isvalidtoken", userAuthMail.tokenconfirmed); //이메일 url을 클릭했을때 파라미터의 토큰이 유효한지 확인
router.post("/resetpassword", userAuthMail.resetpassword); //이때 body에 토큰과 함께 패스워드를 보냄. 토큰이 맞으면 패스워드를 바꿔줌. 틀리면 안바꿔줌.
module.exports= router;
