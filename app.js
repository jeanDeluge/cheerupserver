const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 5000;
<<<<<<< HEAD
=======

>>>>>>> 6c95bac4e78f79bfe7be149e108c3bc51e27e53e

const user = require("./routers/auth/user");
const card = require("./routers/auth/card");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", user);
app.use("/card", card);

app.set('jwt-secret', process.env.SECRET)


app.listen(port, () => {
  console.log("app start", port);
});
