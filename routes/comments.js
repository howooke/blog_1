const express = require("express")
const Comment = require("../schemas/comment")
const authMiddleware = require("./auth-middleware")
const router = express.Router()


//댓글 조회
router.get("/comments/:articleId", async (req,res)=> {
    try {
        const { articleId } = req.params

        const comments = await Comment.find({ articleId: articleId }).sort({commentId: -1})
        res.json({comments: comments})

    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: "댓글 목록 불러오기 에러"
        })
    }
})


//댓글 작성
router.post("/comments", authMiddleware, async (req,res)=> {
    try {
        const maxCommentId = await Comment.findOne().sort("-commentId").exec()
        let commentId = 1
        if (maxCommentId) {
            commentId = maxCommentId.commentId +1
        }

        const postComment = await Comment.create({          //다른 때와 같이 맨위줄에 req.body로 불러오지 않고 아래에 작성한 이유는 let commentId 까지 선언하면 변수가 두번선언되어서 오류
            articleId: req.body.articleId,
            commentId: commentId,               //위에 commentId에 조건식을 따라야하기때문에 이렇게 작성한다.
            nickname:req.body.nickname,
            comment:req.body.comment,
        })

        res.send({comments: postComment })

    } catch (err) {
        console.log(err)
        res.status(400).send({
            errorMessage: " 댓글 작성 에러 "
        })
    }
})

//댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async (req,res)=> {
    const { commentId } = req.params
    
    await Comment.deleteOne({commentId})
        
    res.json({success: true})
})


//댓글 수정
router.patch("/comments/:commentId", authMiddleware, async (req,res)=> {
    const { commentId } = req.params
    const { comment } = req.body

    const patchComment = await Comment.findOne({ commentId })
    if (!patchComment) {
        res.status(400).send({
            errorMessage: "댓글이 없습니다."
        })
        return
    }
    else if (comment) {
        await Comment.updateOne({ commentId }, {$set: { comment }})
    }
    res.status(201).send({ comment })
})

module.exports = router