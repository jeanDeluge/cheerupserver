const { User } = require("../models");
const crypto = require("crypto");
const { request } = require("http");
const { response } = require("express");
const { reject, resolve } = require("bluebird");

module.exports = {
  join: (request, response) => {
    const {
      userId,
      userPassword,
      userName,
      birthday,
      sex,
      interest,
    } = request.body;

    const salt = "cheer";
    const key = crypto
      .createHmac("sha256", salt)
      .update(userPassword)
      .digest("hex");

    User.findOrCreate({
      where: {
        userId: userId,
      },
      defaults: {
        userPassword: key,
        userName,
        birthday,
        sex,
        interest,
      },
    })
      .then(async ([User, created]) => {
        if (!created) {
          response.status(409).send("회원가입실패");
        } else {
          const data = await User.get({ plain: true });
          response.status(200).json(data);
        }
      })
      .catch((e) => {
        console.log(e);
        response.status(500);
      });
  },
  login: async (request, response) => {
    const { userId, userPassword } = request.body;

    try {
      const token = jwt.sign(
        {
          userId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m",
        }
        // (error, token) => {
        //   if (error) {
        //     reject(error);
        //   } else {
        //     resolve(token);
        //   }
        // }
      );

      await user.findOne({
        where: {
          userId,
          userPassword,
        },
      });

      response.status(200).json({ message: "로그인되었습니다.", token: token });
    } catch (error) {
      console.log(error);
      response.status(404).json("로그인 실패");
    }
  },
  // 토큰 구현 후, 진행 예정.
  // logout : async (request, response)=>{
  //   const {userId} = request.body;
  //   try{
  //     await user.
  //   }

  // }
};
