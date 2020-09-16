
const { User } = require("../models");
const { VerifyingToken } = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

function sendPasswordResetMail(message) {
 
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail.send(message);
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
          to: emailaddress,
          from: process.env.EMAIL,
          subject: "비밀번호 변경을 위한 인증요청 메일입니다.",
          html:
            "" +
            `<div><h1>안녕하세요<h1><a href="http://${host}/mail/isvalidtoken/?x-access-reset-token=${tokenEncrypted}"><p>클릭하시면 비밀번호 변경페이지로 이동합니다. </p></a><div>`,
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
  },//토큰인증확인 로직 따로 구현하기
  tokenconfirmed: async (request, response)=>{

    const tokenreceived = request.url.split("=")[1];

    
    const isMatchToken = await VerifyingToken.findOne({
      where: {
        token: tokenreceived,
      },
    });

    if (!isMatchToken) {
      response.status(404).json("인증을 다시 받으시오");
    } else {
      response.status(200).json({message: "인증완료", token: tokenreceived}) 
    }
  }
  ,resetpassword: async (request, response) => {
    
    const tokenreceived = request.body.token
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

        if (getUser) {
          response.status(202).json({
            message: "비밀번호 변경 성공",
          });
        } else {
          response.status(403).json({
            message: "데이터테이블에서 비밀번호 번경 실패",
          });
        }
      }
    } catch(e){
      response.status(402).json({ message: "비밀번호 번경 실패" });
    }
  }
};
