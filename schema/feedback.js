'use strict'
const mongoose = require('mongoose')

// 创建schema
const feedback = new mongoose.Schema({
    fromId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String, default: "" },
    created: { type: Number, default: (new Date()).getTime() },
    format: { type: Date, default: Date.now },
})

//  创建model
const feedbackModel = mongoose.model('feedback', feedback, 'feedback') // newClass为创建或选中的集合

module.exports = feedbackModel