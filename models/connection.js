const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/Tamu_Project"
mongoose.connect(url)
const db = mongoose.connection
console.log("Successfully connected to mongodb database")
module.exports = db