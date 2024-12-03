const mongoose = require('mongoose')

function connectDataBase(url: string){
    mongoose.connect(url)
}
module.exports = connectDataBase