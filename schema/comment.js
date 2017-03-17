'use strict'
const mongoose = require('mongoose')
// var connectDB = require('../connectdb')
// connectDB(mongoose)

// 创建schema
const comment = new mongoose.Schema({
    // fromId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    // toId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    // layer:{type:Number,default:1},
    // trendId:{type:mongoose.Schema.Types.ObjectId,ref:'trend'},
    // content:String,
    // commentId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    // repId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    // created: { type: Number, default: new Date().getTime() },
    // format:{ type: Date, default: Date.now },

    fromId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    toId:{type:mongoose.Schema.Types.ObjectId,ref:'trend'},
    content:String,
    created: { type: Number, default: new Date().getTime() },
    format:{ type: Date, default: Date.now },
})


// 创建model
const commentModel = mongoose.model('comment', comment,'comment') // newClass为创建或选中的集合

module.exports = commentModel