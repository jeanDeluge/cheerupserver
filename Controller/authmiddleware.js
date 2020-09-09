const jwt = require("jsonwebtoken");
const { nextTick } = require("process");

module.exports = async function authMiddleware(request, response) {
  const token = req.headers["x-access-token"] || request.query.token;

  const auth = await new Promise((resolve, rejects) => {
    jwt
      .verify(token, request.app.get("jwt-secret"), (err, decoded) => {
        if (err) reject(err);
        resolve(decode);
      })
      .then((decode) => {
        request.decode = decode;
      })
      .catch((e) => {
        response.status(403).json({
          success: false,
          message: error.message,
          add: "add",
        });
      });
  });
};
