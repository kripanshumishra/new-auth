const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        dropDups: true
    },
    mobile:Number,
    role:String,
    password:String,
})

const User = mongoose.model('userData',user)
module.exports = User