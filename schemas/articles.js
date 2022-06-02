const mongoose = require("mongoose")



const articleSchema = new mongoose.Schema({
    articleId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        unique: true,
    },
    date: {
        type: Date,
    },
    text: {
        type: String,
    },
})



module.exports = mongoose.model("Articles",articleSchema)


//포스트용
// {
//     "articleId": 5,
//     "title": "가자",
//     "nickname": "이호욱5",
//     "text": "Hello World!!!!!"
// }