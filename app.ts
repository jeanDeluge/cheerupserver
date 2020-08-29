import express from 'express'

const app = express()

app.get('/', (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    console.log('nodemon')
    res.send('Hello')
})


app.listen(3002, ()=>{
    console.log('app started!')
})
