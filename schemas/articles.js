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
    name: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
    },
    password: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
    },
})



module.exports = mongoose.model("Articles",articleSchema)


//포스트용
// {
//     "articleId": 3,
//     "title": "가자3",
//     "name": "이호욱3",
//     "password": 1234,
//     "text": "Hello World!!!!!"
// }