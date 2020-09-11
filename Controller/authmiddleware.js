const jwt = require('jsonwebtoken');


module.exports = async function authMiddleware(request, response) {
  const token = request.headers["x-access-token"] || request.query.token;


        const auth = await new Promise( (resolve, reject) =>{
            jwt.verify(token, request.app.get('jwt-secret'),
            (err, decoded) =>{
                if(err) reject(err)
                resolve(decoded)
            }).then( decoded => {
                request.decoded = decoded
            })
            .catch(e =>{
                response.status(403).json({
                    success: false,
                    message: error.message,
                    add : "add"
                })
            })
        })
    }
