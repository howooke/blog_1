const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    articleId: {
        type: Number,
    },
    commentId: {
        type: Number,
        required: true,
    },
    nickname: {
        type: String,
    },
    comment: {
        type: String,
    }
})


module.exports = mongoose.model("Comment", commentSchema)