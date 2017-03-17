'use strict'
const mongoose = require('mongoose')

// 创建schema
const trend = new mongoose.Schema({
    fromId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String, default: "" },
    gender: { type: Number, default: 0 },
    created: { type: Number, default: (new Date()).getTime() },
    format: { type: Date, default: Date.now },
    urls: Array,
    likeIds: Array,
    scans: { type: Number, default: 0 },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },
    likes:{type:Number,default:0}
})

//  创建model
const trendModel = mongoose.model('trend', trend, 'trend') // newClass为创建或选中的集合

module.exports = trendModel