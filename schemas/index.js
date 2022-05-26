const mongoose = require("mongoose")

const connect = () => {
    mongoose.connect("mongodb+srv://test:sparta@cluster0.hlswz.mongodb.net/?retryWrites=true&w=majority",{ignoreUndefined: true}).catch((err) => {
        // mongodb+srv://test:sparta@cluster0.hlswz.mongodb.net/?retryWrites=true&w=majority
        // mongodb://localhost:27017/blod_1
        console.error(err)
    })
}

module.exports = connect

