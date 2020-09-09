const { User, Card, Comment } = require("../models");
const { request } = require("http");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  //header에 담긴 유저정보를 해독 후, 그 유저정보와 일치하는 카드 생성.
  create: async (request, response) => {
    const token = request.headers.authorization;
    const { text } = request.body;
    try {
      //token에 담긴 유저정보를 해독.
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      //user 정보 확인.
      const user = await User.findOne({
        where: { userId: _id },
      });
      //card table을 만든다 - user_Id는 로그인한 유저테이블의 인덱스와 일치한다.
      const card = await Card.create({
        user_Id: user.dataValues.id,
        text: text,
      }).then((result) => {
        console.log("then", result.dataValues);
        response.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
      response.status(403).json("카드생성실패");
    }
  },
  //header에 담긴 유저정보를 해독 후, 로그인한 유저가 작성한 카드 내용
  get: async (request, response) => {
    const token = request.headers.authorization;
    try {
      //token에 담긴 유저정보를 해독.
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      //user 정보 확인.
      const user = await User.findOne({
        where: { userId: _id },
      });
      //card table의 user_Id를 바로 위 코드(로그인 한 유저정보)참조로,
      //로그인 한 유저가 작성한 카드를 모두 가져옴.
      const card = await Card.findAll({
        where: {
          user_Id: user.dataValues.id,
        },
        //정렬 : 생성날짜 가장최근날짜가 가장 위로 나오게

        order: [["createdAt", "DESC"]],
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (e) {
      console.log(e);
      response.status(403).json("카드정보를 가져올 수 없습니다");
    }
  },

  //로그인 한 유저정보, post요청 text 를  request.body로 받아옴.
  update: async (request, response) => {
    const token = request.headers.authorization;
    const { text, id } = request.body;
    console.log("body", request.body);
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });
      // console.log("user", user);
      const card = await Card.findOne({
        where: {
          user_Id: user.dataValues.id,
          id: id,
        },
      }).then((result) => {
        //결과 값을 request.body로 받아온 text로, 기존 작성된 text를 수정 후 Response로 전송
        if (result) {
          result.update({
            text: text,
          });
          console.log(result);
          response.status(200).json(result);
        }
      });
    } catch (error) {
      console.log(error);
      response.status(404).json("wrong req");
    }
  },
  //로그인 한 유저의 정보를 바탕으로,
  //request.body로 card.id를 받아와서, 유저정보&카드아이디 2가지 정보를 만족하는, 카드 삭제
  delete: async (request, response) => {
    const token = request.headers.authorization;
    const { id } = request.body;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });
      const card = await Card.destroy({
        where: {
          id: id,
        },
      }).then((result) => {
        console.log(result);
        response.status(200).json("deleted");
      });
    } catch (error) {
      console.log(error);
    }
  },

  //모든 카드를 메인페이지에 렌더하기 위한 getAll
  getAll: async (request, response) => {
    try {
      const card = await Card.findAll({
        order: [["createdAt", "DESC"]],
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (e) {
      console.log(e);
      response.status(403).json("카드정보를 가져올 수 없습니다");
    }
  },

  //클라이언트 요청 중 유저가 로그인 한 유저가, 본인의 카드 클릭시, 모달창이 열리며,
  //그 카드 내용과 카드에 남겨진 모든 댓글들을 볼 수 있도록 댓글 테이블을 조인
  //댓글을 남긴 유저id를 찾기 위해 user테이블도 조인하여, 데이터 보냄
  getUrl: async (request, response) => {
    const token = request.headers.authorization;
    const query = request.query;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });

      const card = await Card.findAll({
        //raw: true,
        include: [
          {
            model: Comment,
            as: "Comment",
            attributes: ["id", "text", "user_id"],
            include: [
              {
                model: User,
                as: "User",
                attributes: ["userName"],
              },
            ],
          },
        ],
        where: {
          user_Id: user.dataValues.id,
          id: query.id,
        },
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (error) {
      console.log("err", error);
    }
  },
};

//Create
//Read
//Update
//Delete
