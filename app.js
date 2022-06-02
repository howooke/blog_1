const express = require("express")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const User = require("./schemas/user")

const app = express()
const port = 3000

mongoose.connect("mongodb://localhost:27017/blod_1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));



const articleRouter = require("./routes/articles")
const usersRouter = require("./routes/users")
const commentsRouter = require("./routes/comments")
const authMiddleware = require("./routes/auth-middleware")


const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, "=", new Date())
    next()
}

app.use(express.json())
app.use(requestMiddleware)



app.use("/api", express.urlencoded({ extended: false }), [articleRouter, usersRouter, commentsRouter, authMiddleware])


app.get("/", (req, res)=> {
    res.send("/root  page!")
})

app.listen(port, ()=> {
    console.log(port, "포트로 서버가 켜짐!")
})



module.exports = app;



