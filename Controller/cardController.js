const { User, Card } = require("../models");
const { request } = require("http");

module.exports = {
  //userId와 같은 id의 카드가 없으면 만든다.
  create: (request, response) => {
    const { userId } = request.body;
    try {
      Card.findOrCreate({
        where: {
          userId: userId,
        },
        include: {
          model: User,
          as: "user",
          attributes: ["userName"],
          required: true,
        },
      });
      response.status(200).json("카드생성완료");
    } catch (e) {
      console.log(e);
      response.status(403).json("카드생성실패");
    }
  },
  //userId와 같은 id의 card를 모두 가져온다.
  get: (request, response) => {
    const { userId } = request.body;
    try {
      Card.findAll({
        include: {
          model: User,
          as: "user",
          attributes: ["userName"],
        },
        where: {
          userId: userId,
        },

        order: [["createdAt", "DESC"]],
      });
      response.status(200).json("카드정보읽기완료");
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
