const nodemailer = require("nodemailer");
const { User } = require("../models");
const { VerifyingToken } = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//인증을 위한 토큰 생성하기
//이메일을 입력하고,

function sendPasswordResetMail(mailOptions) {
  const mailConfig = {
    service: "Daum",
    host: "smtp.daum.net",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(mailConfig);
  transporter.sendMail(mailOptions);
}

module.exports = {
  sendResetmessage: async (request, response) => {
    const emailaddress = request.body.email;

    try {
      if (emailaddress === "") {
        response.status(400).json("이메일을 입력해주세요.");
      }
      const userWantPassword = await User.findOne({
        where: { userId: emailaddress },
      });
      const token = jwt.sign(
        {
          id: emailaddress,
        },
        process.env.SECRET,
        { expiresIn: "7d" }
      ); // **배포시느에ㅡ안전을 위해 한시간으로 설정함

      const tokenEncrypted = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      //VerfyingToken 테이블에 넣어둘것임 : 예전에 회원가입때 썼던 곳

      const tokenToTable = await VerifyingToken.update(
        {
          token: tokenEncrypted,
        },
        {
          where: {
            user_Id: userWantPassword.dataValues.id,
          },
        }
      );
      if (tokenToTable) {
        const host = request.headers.host;
        //Verf yingToken 테이블에 넣어둘것임 : 예전에 회원가입때 썼던 곳

        let messageWithToken = {
          from: process.env.EMAIL,
          to: emailaddress,
          subject: "비밀번호 변경을 위한 인증요청 메일입니다.",
          html:
            "" +
            `<div><h1>안녕하세요<h1><a href="http://${host}/mail/resetpassword/?x-access-reset-token=${tokenEncrypted}"><p>클릭하시면 비밀번호 변경페이지로 이동합니다. </p></a><div>`,
        };
        sendPasswordResetMail(messageWithToken);
        response.status(200).json({
          message: "mail sent, 비밀번호 변경페이지로 이동부탁",
          token: tokenEncrypted, //**배포시 삭제해야함!!
        });
      } else {
        response.status(400).json({ message: "토큰 테이블이 만들어지지 않음" });
      }
    } catch (err) {
      response.status(401).json({ message: "이메일 인증 실패." });
    }
  },
  resetPassword: async (request, response) => {
    const tokenreceived = request.url.split("=")[1];
    const newPassword = request.body.newPassword;

    try {
      const chiperedPassword = crypto
        .createHash("sha256")
        .update(newPassword)
        .digest("hex");

      const isMatchToken = await VerifyingToken.findOne({
        where: {
          token: tokenreceived,
        },
      });
      if (!isMatchToken) {
        response.status(404).json("인증을 다시 받으시오");
      } else {
        const getUser = await User.update(
          {
            userPassword: chiperedPassword,
          },
          {
            where: { id: isMatchToken.dataValues.user_Id },
          }
        );
        console.log(isMatchToken.dataValues.user_Id);

        console.log(chiperedPassword);
        if (getUser) {
          response.status(202).json({
            message: "비밀번호 변경 성공",
          });
        } else {
          response.status(404).json({
            message: "데이터테이블에서 비밀번호 번경 실패",
          });
        }
      }
    } catch(e){
      response.status(402).json({ message: "비밀번호 번경 실패" });
    }
  }
};
