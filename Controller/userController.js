const { User } = require("../models");
const { VerifyingToken } = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

function sendJoinMail(mailOptions) {
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
  join: async (request, response) => {
    const {
      userId,
      userPassword,
      userName,
      age,
      gender,
      interest,
    } = request.body;
    const encrypted = crypto
      .createHash("sha256")
      .update(userPassword)
      .digest("hex");
    try {
      const tokenForSignUp = jwt.sign(
        {
          _id: userId,
        },
        process.env.SECRET /* ,
            {expiresIn:'24h'} */
      );

      const [user, create] = await User.findOrCreate({
        where: {
          userId,
        },
        defaults: {
          userPassword: encrypted,
          userName,
          age,
          gender,
          interest,
        },
      });
      const [token, isCreatedToken] = await VerifyingToken.findOrCreate({
        where: {
          user_Id: user.dataValues.id,
          token: tokenForSignUp,
        },
      });
      // const data = user;
      // console.log(data)

      const host = request.headers.host;

      let messageWithToken = {
        from: process.env.EMAIL,
        to: userId,
        subject: "이메일인증요청메일입니다.",

        html:
          "" +
          `<div><h1>안녕하세요<h1><a href ="http://${host}/mail/confirmemail/?x-access-join-token=${tokenForSignUp}" ><p>클릭하시면 이메일 인증 페이지로 이동합니다.</p></a> <div>`,
      };
      //
      //http://localhost:5000/asdjfoaidjfadf
      //클라이언트 쪽에서 토큰을 header저장
      if (!create) {
        response.status(403).json({ messasge: "회원이 이미 있음" });
      } else if (isCreatedToken) {
        sendJoinMail(messageWithToken);

        response.status(200).json({
          message: "mail send  mail 인증부탁드립니다.",
          token: token.dataValues.token, //이건 배포시 삭제해야함.
        });
      } else {
        response.status(400).json({ messgae: "인증안됨" });
      }
    } catch (e) {
      response.status(409).json("회원가입 실패");
      console.log(e);
    }
  },
  confirmMail: async (request, response) => {
    try {
      const url = request.url
      let GetTokenFromUrl = url.split("=");

      const tokenSent =GetTokenFromUrl[1];
      console.log(tokenSent, "파라미터")
      let verify = jwt.verify(tokenSent, process.env.SECRET);
      verify = verify._id;

      const tokenInDB = await VerifyingToken.findOne({
        where: { token: tokenSent },
      });

      if (!tokenInDB) {
        response.status(403).json("회원정보에 토큰이 존재하지 않음");
      } else {
        //유저 인증 true로 만들어주기
        const userverify = await User.update(
          {
            verified: true,
          },
          {
            where: {
              userId: verify,
            },
          }
        );
        const user = await User.findOne({
          where: { userId: verify },
        });
        const deleteTokenInDB = await VerifyingToken.update(
          { token: "0" },
          {
            where: { user_Id: user.dataValues.id },
          }
        );
        console.log(deleteTokenInDB, "tokenDB");
        if (user.dataValues.verified === true) {
    
          response.status(200).json("이메일 인증 됨/ 회원가입 완료");       
        } else {
          response.status(403).json("이메일 인증 실패");
        }
      }
    } catch (e) {
      console.log(e);
      response.status(400).json("토큰 정보가 틀리거나 인증 만료됨");
      response.end();
    }
  },
  login: async (request, response) => {
    const { userId, userPassword } = request.body;
    const secret = request.app.get("jwt-secret");
    const cryptedPassword = crypto
      .createHash("sha256")
      .update(userPassword)
      .digest("hex");
    try {
      //check user infor, generate jwt
      const user = await User.findOne({
        where: {
          userId,
          userPassword: cryptedPassword,
        },
      });
      console.log(user, "user");
      if (user.dataValues.verified === false) {
        response.status(400).json("이메일 인증하세요");
      }
      if (!user) {
        response.status(403).json("user does not exist");
      } else {
        const token = jwt.sign(
          {
            _id: userId,
          },
          secret /* ,
                {expiresIn:'7d' }*/
        );

        response.status(200).json({
          token,
          age: user.dataValues.age,
          gender: user.dataValues.gender,
          interest: user.dataValues.interest,
          id: user.dataValues.id,
        });
      }
    } catch (error) {
      response.status(403).json({
        messasge: error.messasge,
        error: "logged in failed",
      });
    }
  },
  check: (request, response) => {
    try {
      const token = request.headers["x-access-token"];
      let verify = jwt.verify(token, process.env.SECRET);
      verify = verify._id;

      const user = User.findOne({
        where: {
          userId: verify,
        },
      });

      if (user) {
        response.status(200).json("유효함");
      } else {
        response.status(401).json("need user session");
      }
    } catch (error) {
      response.status(401).json("유효하지 않은 사용자");
    }
  },
  logout: async (request, response) => {
    request.session.destroy((err) => {
      if (!err) {
        response.clearCookie("user");
        response.status(302).redirect("/");
      } else {
        response.status(400).end();
      }
    });
  },
  info: (request, response) => {
    const { age, gender, interest } = request.body;
    const token = request.headers.authorization;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      const user = User.findOne({
        where: {
          userId: _id,
        },
      }).then((result) => {
        if (result) {
          result.update({
            age,
            gender,
            interest,
          });
          console.log(result);
          response.status(200).json(result);
        }
      });
      console.log(result);
      response.status(200).json(result);
    } catch (error) {
      console.log(error);
      response.status(404).json("추가정보입력실패");
    }
  },
};
