var user = require('../schema/user')
var connectDB = require('../connectdb')
var mongoose = require('mongoose')
connectDB(mongoose)

var checkToken = function (token) {
    user.findOne({ 'token': token }, function (err, doc) {
        console.log(doc)
        if (err) console.log(err)
        if (doc == null) {
            return false
        } else {
            return true
        }
    })
}

module.exports = checkToken