
const {User} = require("../models");
const {VerifyingToken} = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const verifyingtoken = require("../models/verifyingtoken");
const { response } = require("express");

function sendJoinMail(mailMessageWithToken){
    const mailConfig = {
        service : 'Naver',
        host : 'smtp.naver.com',
        port : 587,
        auth:{
            user: 'sirblaue@naver.com',
            pass: process.env.PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(mailConfig)
    transporter.sendMail(mailMessageWithToken)
}

module.exports={
    
    join: async(request, response) => {
        const { userId, userPassword, userName, age, gender, interest} = request.body;

        const encrypted = crypto.createHash('sha256').update(userPassword).digest('hex')


        try {
            const tokenForSignUp = jwt.sign({
                _id : userId
            },process.env.SECRET,
            {expiresIn:'24h'})


            const [token, isCreatedToken] = await VerifyingToken.findOrCreate({
                where: {
                    userId,
                    token : tokenForSignUp
                }
            })
            const [user, create] = await User.findOrCreate({
                where:{
                    userId
                },
                defaults:{
                    userPassword: encrypted,
                    userName,

                    age,
                    gender,
                    interest
                }
            });
            const [token, isCreatedToken] = await VerifyingToken.findOrCreate({
                where: {
                    user_Id : user.dataValues.id,
                    token : tokenForSignUp
                }
            })
            // const data = user;   
            // console.log(data)
            const host = "http://localhost:5000"

            let messageWithToken = {
                from: 'sirblaue@naver.com',
                to: userId,
                subject: "이메일인증요청메일입니다.",

                html: ""+`<div><a href ="${host}+"/confirmEmail/"+${tokenForSignUp}" ></a> <div>`

            }
            //
            //http://localhost:5000/asdjfoaidjfadf
            //클라이언트 쪽에서 토큰을 header저장 

            if(!create){
                response.status(403).json({messasge: "회원이 이미 있음"})
            }else if(isCreatedToken){
                sendJoinMail(messageWithToken);
                response.status(200).json({message: "mail send  mail 인증부탁드립니다."})
            }else{
                response.status(400).json({messgae: '인증안됨'})
]
            }
        }catch(e){
            response.status(409).json("회원가입 실패")
            console.log(e)
        }
    },confirmMail:(request, response)=>{
        const token = request.headers['x-access-join-token'] || request.headers.token;
        let verify = jwt.verify(token, process.env.SECRET);
        verify = verify._id;
        if(verify){
            User.update({
                where:({
                    userId: verify
                })
            })
        }

    },
    login: async(request, response)=>{
        const {userId, userPassword} = request.body;
        const secret = request.app.get('jwt-secret')
        const cryptedPassword = crypto.createHash('sha256').update(userPassword).digest('hex')

        try{
        //check user infor, generate jwt
            const user = await User.findOne({
                where: {
                    userId,
                    userPassword : cryptedPassword,
                    verified: true
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