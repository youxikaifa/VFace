'use strict'
const mongoose = require('mongoose')
var hat = require('hat')
// var connectDB = require('../connectdb')
// connectDB(mongoose)

// 创建schema
const user = new mongoose.Schema({
    name: {type:String,default:""},
    account:{type:String,default:""},
    password:{type:String,default:""},
    avatar:{type:String,default:""},
    token:{type:String,default:hat.rack()},
    gender:{type:Number,default:0},
    motto:{type:String,default:'暂无心情'},
    format: { type: Date, default: Date.now },
    created: { type: Number, default: new Date().getTime() },
    age:{type:Number,default:0},
    province:{type:String,default:""},
    city:{type:String,default:""},
    level:{type:Number,default:0},
    trends:[{type:mongoose.Schema.Types.ObjectId,ref:'trend'}],
})

user.methods.speak = function (word) {
    console.log(word)
}
// 创建model
const userModel = mongoose.model('user', user,'user') // newClass为创建或选中的集合

module.exports = userModel