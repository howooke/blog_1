const express = require("express")
const Articles = require("../schemas/articles")
const router = express.Router()
const moment = require("moment")
const authMiddleware = require("./auth-middleware")

router.get("/", (req,res)=> {
    res.send('api page')
})

// router.get("/login", (req, res)=> {
//     res.send('login page')
// })


//게시글 조회
router.get("/articles", async (req, res)=> {
    const {articleId,title,name,date} = req.body

    const articles = await Articles.find().sort({ date : -1})

    res.json({
        articles
    })
})

//상세조회
router.get("/articles/:articleId", async (req, res)=> {
    const {articleId} = req.params

    const [detail] = await Articles.find({ articleId })

    res.json({
        detail
    })
})

//게시글 삭제
router.delete("/articles/:articleId", authMiddleware, async (req, res)=> {
    const { articleId } = req.params
    const { password } = req.body

    const deleteArticle = await Articles.find({ articleId })

    // if (!password) {
    //     res.status(400).json({
    //         errorMessage: "패스워드가 없습니다."
    //     })
    //     return
    // }
    // if (password !== deleteArticle[0].password){
    //     res.status(400).json({
    //         errorMessage: "패스워드가 틀립니다."
    //     })
    //     return
    // }
    if (deleteArticle.length) {
        await Articles.deleteOne({ articleId })
    }

    res.json({ success: true })
})


//게시글 수정

router.put("/articles/:articleId",authMiddleware, async (req, res)=> {
    const { articleId } = req.params
    // const { password } = req.body
    const { title } = req.body
    const { text } = req.body

    const articlesPut = await Articles.find({ articleId })

    // if (!password) {
    //     res.status(400).json({
    //         errorMessage: "패스워드가 없습니다."
    //     })
    //     return
    // }
    // if (password !== articlesPut[0].password){
    //     res.status(400).json({
    //         errorMessage: "패스워드가 틀립니다."
    //     })
    //     return
    // }
    if (articlesPut.length) {
        await Articles.updateOne({ articleId }, {$set: { title }})
        await Articles.updateOne({ articleId }, {$set: { text }})
    }

    res.json({ success: true })


})



// 게시글 작성
router.post("/articles",authMiddleware, async (req, res)=> {
    const {articleId, title, nickname, text} = req.body
    const date = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')

    const articles = await Articles.find({articleId})
    if (articles.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터 입니다." })
    }

    // if (!password) {
    //     res.status(400).json({
    //         errorMessage: "패스워드를 입력하세요."
    //     })
    //     return
    // }

    const createdArticles = await Articles.create({ articleId, title, nickname,  text, date })


    res.json({articles: createdArticles})
})



module.exports = router