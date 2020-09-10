const { User, Card, Comment, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { request, response, text } = require("express");
const Sequelize = require("sequelize");
const { group } = require("console");
const Op = Sequelize.Op;

dotenv.config();

module.exports = {
  //header로 전달받은 user정보로 userTable의 user정보를 찾고,
  //그 user의 정보를 comment 테이블에 넣고, comment를 만든다.
  create: async (request, response) => {
    const { text, id } = request.body;
    const token = request.headers.authorization;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      const user = await User.findOne({
        where: { userId: _id },
      });
      const comment = await Comment.create({
        user_id: user.dataValues.id,
        text: text,
        card_id: id,
        include: {
          model: Card,
          as: "Cards",
          attributes: ["id", "text"],
        },
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
      response.send(404).json("wrong request");
    }
  },

  get: async (request, response) => {
    const query = request.query;
    const token = request.headers.authorization;
    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;
      const user = await User.findOne({
        where: { userId: _id },
      });
      const comment = await Comment.findAll({
        where: {
          card_id: query.id,
        },
        include: {
          model: User,
          as: "User",
          attributes: ["userName"],
          require: true,
        },
        order: [["updatedAt", "DESC"]],
      }).then((result) => {
        for (let i = 0; i < result.length; i++) {
          console.log(result[i].dataValues);
        }
        response.status(200).json(result);
      });
    } catch (error) {
      console.log(error);
      response.status(403).json("cannot get comments");
    }
  },
  update: async (request, response) => {
    const { card_id, comment_id, text } = request.body;
    //cardid&commentid를 받아서, text를 update
    try {
      const comment = await Comment.findOne({
        where: {
          card_id: card_id,
          id: comment_id,
        },
      }).then((result) => {
        if (result) {
          result.update({
            text: text,
          });
          console.log("result", result);
          response.status(200).json(result);
        }
      });
    } catch (error) {
      console.log("what is error", error);
      response.status(404).json("comment-Update-Error");
    }
  },
  delete: async (request, response) => {
    const query = request.query;
    const { card_id, comment_id } = request.body;

    try {
      const user = await User.findOne({
        where: { userId: _id },
      });
      const comment = await Comment.destroy({
        where: {
          card_id: card_id,
          id: comment_id,
        },
      }).then((result) => {
        console.log(result);
        response.status(200).json("deleted");
      });
    } catch (error) {
      console.log(error);
      response.status(404).json("삭제실패?");
    }
  },
  getCheer: async (request, response) => {
    const token = request.headers.authorization;

    try {
      const verify = jwt.verify(token, process.env.SECRET);
      const { _id } = verify;

      const user = await User.findOne({
        where: { userId: _id },
      });
      console.log(_id);
      const comment = await Comment.findAll({
        where: {
          user_id: user.dataValues.id,
        },

        attributes: ["user_id", "card_id"],
        //raw: true,
        include: [
          {
            model: Card,
            as: "Card",
            attributes: ["id", "text"],
          },
          // {
          //   model: User,
          //   as: "User",
          //   attributes: ["user_id"],
          // },
        ],
        group: ["card_id"],
      }).then((result) => {
        console.log(result);
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
