const { User, Card } = require("../models");
const { request } = require("http");

module.exports = {
  //userId와 같은 id의 카드가 없으면 만든다.
  create: async (request, response) => {
    const { user_Id, text } = request.body;
    try {
      const card = await Card.findOrCreate({
        include: {
          model: User,
          as: "User",
          attributes: ["userName"],
        },
        where: {
          user_Id: user_Id,
          text: text,
        },
      }).then((result) => {
        response.status(200).json(result);
      });
    } catch (e) {
      console.log(e);
      response.status(403).json("카드생성실패");
    }
  },
  //userId와 같은 id의 card를 모두 가져온다.
  get: async (request, response) => {
    const { user_Id } = request.body;
    try {
      const card = await Card.findAll({
        include: {
          model: User,
          as: "User",
          attributes: ["userName"],
        },
        where: {
          user_Id: user_Id,
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
    const { user_Id, text, id } = request.body;
    console.log(request.body.dataValues);
    try {
      const card = await Card.findOne({
        where: {
          user_Id: user_Id,
          id: id,
        },
      }).then((result) => {
        if (result) {
          // console.log("what is result?", result);
          result.update({
            text: text,
          });
          console.log(result);
          response.status(200).json({ result });
        } else {
          response.status(401).json("fail");
        }
      });
    } catch (e) {
      console.log(e);
      response.status(404).json("wrong req");
    }
  },
  delete: async (request, response) => {
    const { user_Id, id } = request.body;
    try {
      const card = await Card.destroy({
        where: {
          user_Id: user_Id,
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
};

//Create
//Read
//Update
//Delete
