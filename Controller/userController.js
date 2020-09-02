const {User} = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


module.exports={
    join: async(request, response) => {

        const { userId, userPassword, userName, birthday, sex, interest} = request.body;
        const encrypted = crypto.createHash('sha256').update(userPassword).digest('hex')

        try {
            const [user, create] = await User.findOrCreate({
                where:{
                    userId
                },
                defaults:{
                    userPassword: encrypted,
                    userName,
                    birthday,
                    sex,
                    interest
                }
            });
            // const data = user;
            // console.log(data)
            if(!create){
                response.status(403).json({messasge: "회원이 이미 있음"})
            }else{
                response.status(200).json("회원가입완료")
            }
        }catch(e){
            response.status(409).json("회원가입 실패")
        }
    },
    login: async(request, response)=>{
        const {userId, userPassword} = request.body;
        const secret = request.app.get('jwt-secret')
        const newPassword = crypto.createHash('sha256').update(userPassword).digest('hex')
        try{
        //check user infor, generate jwt
        
            const user = await User.findOne({
                where: {
                    userId,
                    userPassword
                }
            }).then(user=>{
                if(!user){
                    response.status(403).json("user does not exist")
                }else{
                    const token= jwt.sign({
                        _id: userId,
                    },
                    secret,
                    {expiresIn:'30m'}
                    )

                    return token
                }
            }).then(token=>{
                response.status(200).json({
                    messasge: "logged in successfully",
                    token
                })
            })
        }catch(error){
            response.status(403).json({
                messasge: error.messasge,
                error: "logged in failed"
            })
        }
    },
    check : (request, response)=>{
        try{

        const token = request.headers['x-access-token'] || request.headers.token
        let verify = jwt.verify(token, process.env.SECRET);
        verify = verify._id;


        if(verify){
            User.findOne({
                where:{
                    userId:verify
                }
            }

            ).then(result =>{
                response.status(200).json('유효함')
            })
        }else{
            response.status(401).json('need user session')
        }
        }catch(error){
           response.status(401).json('유효하지 않은 사용자')
        }
    },
    logout: async (request, response)=>{
        request.session.destroy((err)=>{
            if(!err){
                response.clearCookie('user');
                response.status(302).redirect('/');
            }else{
                response.status(400).end()
            }
        })
    }
}