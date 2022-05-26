const express = require("express")
const connect = require("./schemas")   //  /index   인덱스는 생략가능
const app = express()
const port = 3000


connect()

const articleRouter = require("./routes/articles")


const requestMiddleware = (req, res, next)=> {
    console.log("Request URL:", req.originalUrl, "=", new Date())
    next()
}

app.use(express.json())
app.use(requestMiddleware)




app.use("/api", [articleRouter])       //api를 붙여주고 [articleRouter]를 소환

app.get("/", (req, res)=> {         //얘가 루트
    res.send("/root  page!")
})

app.listen(port, ()=> {
    console.log(port, "포트로 서버가 켜짐!")
})