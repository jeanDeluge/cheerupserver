const express = require("express")
const cors = require("cors");
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;

const user = require("./routers/auth/user");

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors());

app.use("/user", user);


app.set('jwt-secret', process.env.SECRET)

app.listen(port, ()=> {
    console.log(
        'app start',port
    )
})