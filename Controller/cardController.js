const { User, Card } = require("../models");
const { request } = require("http");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  //userId와 같은 id의 카드가 없으면 만든다.
  create: async (request, response) => {
    const token = request.headers.authorization;
    const { text } = request.body;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      const user = await User.findOne({
        where: { userId: _id },
      });
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
  //userId와 같은 id의 card를 모두 가져온다.
  get: async (request, response) => {
    const token = request.headers.authorization;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });
      const card = await Card.findAll({
        where: {
          user_Id: user.dataValues.id,
        },

        order: [["createdAt", "DESC"]],
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (e) {
      console.log(e);
      response.status(403).json("카드정보를 가져올 수 없습니다");
    }
  },
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
        if (result) {
          result.update({
            text: text,
          });
          console.log(result);
          response.status(200).json(result);
        }
        //***혹시 잘못된 요청이 구체적으로 생각 날 경우 response내용 추가.
      });
    } catch (error) {
      console.log(error);
      response.status(404).json("wrong req");
    }
  },
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
};

//Create
//Read
//Update
//Delete
