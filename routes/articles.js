const express = require("express")
const Articles = require("../schemas/articles")
const router = express.Router()
const moment = require("moment")


router.get("/", (req,res)=> {
    res.send('api page')
})


//게시글 조회
router.get("/articles", async (req, res)=> {
    const {articleId,title,name,date} = req.query

    const articles = await Articles.find({ articleId,title,name,date },{ articleId: 1, title: 1, name:1, date:1}).sort({ date:-1 })

    res.json({
        articles
    })
})

//상세조회
router.get("/articles/:name", async (req, res)=> {
    const {name} = req.params

    const [detail] = await Articles.find({ name })

    res.json({
        detail
    })
})

//게시글 삭제
router.delete("/articles/:name", async (req, res)=> {
    const { name } = req.params
    const { password } = req.body

    const deleteArticle = await Articles.find({ name })

    if (!password) {
        res.status(400).json({
            errorMessage: "패스워드가 없습니다."
        })
        return
    }
    if (password !== deleteArticle[0].password){
        res.status(400).json({
            errorMessage: "패스워드가 틀립니다."
        })
        return
    }
    if (deleteArticle.length) {
        await Articles.deleteOne({ name })
    }

    res.json({ success: true })
})


//게시글 수정

router.put("/articles/:name", async (req, res)=> {
    const { name } = req.params
    const { password } = req.body
    const { title } = req.body
    const { text } = req.body

    const articlesPut = await Articles.find({ name })

    if (!password) {
        res.status(400).json({
            errorMessage: "패스워드가 없습니다."
        })
        return
    }
    if (password !== articlesPut[0].password){
        res.status(400).json({
            errorMessage: "패스워드가 틀립니다."
        })
        return
    }
    if (articlesPut.length) {
        await Articles.updateOne({ name }, {$set: { title }})
        await Articles.updateOne({ name }, {$set: { text }})
    }

    res.json({ success: true })


})



// 게시글 작성
router.post("/articles", async (req, res)=> {
    const {articleId, title, name, password, text} = req.body
    const date = moment().add('9','h').format('YYYY-MM-DD HH:mm:ss')

    const articles = await Articles.find({articleId})
    if (articles.length) {
        return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터 입니다." })
    }

    if (!password) {
        res.status(400).json({
            errorMessage: "패스워드를 입력하세요."
        })
        return
    }

    const createdArticles = Articles.create({ articleId, title, name, password, text, date })


    res.json({articles: createdArticles})
})



module.exports = router