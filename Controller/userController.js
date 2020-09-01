const { User } = require("../models");

module.exports = {
  join: async (request, response) => {
    const {
      userId,
      userPassword,
      userName,
      birthday,
      sex,
      interest,
    } = request.body;
    try {
      const [user, create] = await User.findOrCreate({
        where: {
          userId,
        },
        defaults: {
          userPassword,
          userName,
          birthday,
          sex,
          interest,
        },
      });
      // const data = user;
      // console.log(data)
      response.status(200).json("회원가입완료");
    } catch (e) {
      console.log(e);
      response.status(403).json("회원가입 실패");
    }
  },
};
