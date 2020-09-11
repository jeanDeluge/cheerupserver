const { User, Card, Comment } = require("../models");
const { request } = require("http");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const dotenv = require("dotenv");
const Sequelize = require("sequelize");
const sequelize = require("sequelize");
const { group } = require("console");
dotenv.config();

module.exports = {
  //header에 담긴 유저정보를 해독 후, 그 유저정보와 일치하는 카드 생성.
  create: async (request, response) => {
    const token = request.headers.authorization;
    const { text, D_day } = request.body;
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
        D_day: D_day,
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
        //카드생성 최신순 맨위로 정렬.
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
          user_Id: user.dataValues.id,
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
  //일반적인 get요청에서는, params 로 받겠지만, 클라이언트에서 헤더에 토큰과 함께 id를 보내주게 된다. 쿼리문으로 만들어져서 헤더에 전달되기때문에, 쿼리로 받는다.
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
        //raw: true, -- raw는 join 테이블을 한 객체에 담기 위한, 명령어이다. table명.column명 : 내용   으로 출력된다
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
        //카드의 아이디가 로그인한 유저의 아이디와  동일해야된다.
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
  getOtherUrl: async (request, response) => {
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
          {
            model: User,
            as: "User",
            attributes: ["id"],
          },
        ],
        //카드의 아이디가 로그인한 유저의 아이디와  동일해야된다.
        where: {
          id: query.id,
        },
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (error) {
      console.log("err", error);
    }
  },
  //내가 작성한 카드에 담긴 모든 댓글의 수 === 응원받은 수 를 받아오기위한 API
  getCardComment: async (request, response) => {
    //01 find All where loginUser's Cards JOIN comment Table, like getUrl, & countAll-Each Card's Comments
    const token = request.headers.authorization;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });
      //조건에 맞는 카드를 찾고, 어트리뷰트에 미리 카운트 쿼리문 작성 후, join 하게 되면. join된 테이블이 정상적으로 카운팅 된다.
      const card = await Card.findAll({
        where: {
          user_Id: user.dataValues.id,
        },
        attributes: {
          include: [
            [
              Sequelize.fn("COUNT", Sequelize.col("Comment.comment_userid")),
              "EachCommentCount",
            ],
          ],
        },
        include: [
          {
            model: Comment,
            as: "Comment",
            attributes: [],
          },
        ],
        group: ["Card.id"],
      }).then((result) => {
        let count = 0;
        for (let i = 0; i < result.length; i++) {
          count = count + result[i].dataValues.EachCommentCount;
        }
        console.log(count);

        response.status(200).json(count);
      });
    } catch (error) {
      console.log(error);
    }
  },
};

//CARD_CRUD 완료
