const nodemailer = require('nodemailer')

//인증을 위한 토큰 생성하기
//이메일을 입력하고, 

module.exports = {
    
    sendingJoinMail: (request, response)=>{
        try {
            const mailConfig = { 
                service : 'Naver',
                host : 'smtp.naver.com',
                port: 587,
                auth:{
                    user:'sirblaue@naver.com',
                    pass: process.env.PASSWORD
                }   
            }
            
            let message = {
                from : 'sirblaue@naver.com',
                to: 'aria2527@gmail.com',
                subject: '이메일 인증 요청 메일입니다.',
                html: '<p> token 검증 URL 넣기 </p>'
            };

            let transporter = nodemailer.createTransport(mailConfig)
            transporter.sendMail(message)
            response.status(200).json("성공!")

        }catch(error){
            response.status(400).json("false")
        }
    }
}