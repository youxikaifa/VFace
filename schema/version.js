'use strict'
const mongoose = require('mongoose')

// 创建schema
const version = new mongoose.Schema({
    versionCode: { type: Number, ref: "user" },
    versionName: { type: String, default: "" },
    msg: { type: String, default: "" },
    created: { type: Number, default:new Date().getTime() },
})

//  创建model
const versionModel = mongoose.model('version', version, 'version') // newClass为创建或选中的集合

module.exports = versionModel