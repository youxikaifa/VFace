var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable')
var http = require('http'),
  util = require('util'),
  os = require('os')
var hat = require('hat')
var rack = hat.rack()
var mongoose = require('mongoose')
var connectDB = require('../connectdb')
var user = require('../schema/user')
var trend = require('../schema/trend')
var comment = require('../schema/comment')
var feedback = require('../schema/feedback')

connectDB(mongoose)
/* GET home page. */
router.save = function (req, res, next) {
  // trend.findOne({'created':1489329988339}).populate('fromId').exec(function(err,docs){
  //   if (err) console.log(err)
  //   res.json(docs)
  // })

  // user.findOne({'created':1489331925866}).populate('trends').exec(function(err,docs){
  //   if (err) console.log(err)
  //   res.json(docs)
  // })

  // console.log(req.headers.token)
  var model = user(req.body)
  model.save(function (err, doc) {
    if (err) throw err;
    // console.log(doc)
    res.send('Succeed')
  })
}

router.loadTrend = function (req, res) {
  // trend.find({}, function (err, docs) {
  //   if (err) console.log(err)
  //   res.json(docs)
  // })
  var curPage = req.query.curPage

  trend.find({},function (err, docs) {
    if (err) console.log(err)
    res.json(docs)
  }).sort({'created':-1}).skip(5*curPage).limit(5).populate('fromId').exec()
}

router.uploadTrend = function (req, res) {

  var token = req.headers.token //新添加代码

  var form = new formidable.IncomingForm();
  form.uploadDir = '/';   //文件保存在系统临时目录
  form.maxFieldsSize = 1 * 1024 * 1024;  //上传文件大小限制为最大1M  
  form.keepExtensions = true;        //使用文件的原扩展名

  var targetDir = path.join(__dirname, '../public/upload');
  // 检查目标目录，不存在则创建
  fs.access(targetDir, function (err) {
    if (err) {
      fs.mkdirSync(targetDir);
    }
    _fileParse();
  });

  // 文件解析与保存
  function _fileParse() {
    form.parse(req, function (err, fields, files) {
      if (err) throw err;

      // var fieldsKeys = Object.keys(fields)
      // console.log(fieldsKeys)

      var filesUrl = [];
      var errCount = 0;
      var keys = Object.keys(files);

      keys.forEach(function (key) {
        var filePath = files[key].path;
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
          errCount += 1;
        } else {
          //以当前时间戳对上传文件进行重命名
          var fileName = rack() + fileExt;
          var targetFile = path.join(targetDir, fileName);
          //移动文件
          fs.renameSync(filePath, targetFile);
          // 文件的Url（相对路径）
          filesUrl.push('/upload/' + fileName)
          fields.urls = filesUrl
        }
      });


      user.findOne({ 'token': token }, function (err, u) {
        if (err) console.log(err)
        fields.fromId = u._id
        var model = trend(fields)
        model.created = new Date().getTime()
        model.save(function (err, doc) {
          if (err) console.log(err)
          user.updateOne({ 'token': token }, { $push: { 'trends': doc._id } }, function (err, uu) {
            if (err) console.log(err)
            //{ filesUrl: filesUrl, success: keys.length - errCount, error: errCount }
            res.json(uu);
          })
        })
      })


    });
  }
}

router.pubComment = function (req, res) {
  var fromId = req.query.fromId
  var model = comment(req.body)
  model.fromId = fromId
  model.created = new Date().getTime()

  model.save(function (err, doc) {
    if (err) console.log(err)
    res.json({'n':1,'nModified':1,'ok':1})
  })
}

router.getComments = function(req,res){
  var toId = req.query.toId
  comment.find({'toId':toId}).sort({'created':-1}).populate('fromId').exec(function(err,trends){
    if (err) console.log(err)
    res.json(trends)
  })
}

router.register = function (req, res) {

  var model = user(req.body)

  user.findOne({ 'account': req.body.account }, function (err, doc) {
    if (err) console.log(err)
    if (doc == null) {
      model.save(function (err, user) {
        if (err) console.log(err)
        // res.json(user)
        login(user.token, res)
      })
    } else {
      res.json({ err: 0, msg: '用户已存在' })
    }
  })
}

router.login = function (req, res) {
  var token = req.headers.token
  login(token, res)
}
/**
 * @param {string} token 身份验证 
 * @param {object} res response 
 */
var login = function (token, res) {
  var newToken = rack()
  user.updateOne({ 'token': token }, { token: newToken }, function (err, doc) {
    if (err) console.log(err)
    if (doc == null) {

      res.json({ result: 0, status: '登录失败,未找到' }) //未找到
    } else {
      user.findOne({ 'token': newToken }, function (err, doc) {
        if (err) console.log(err)
        res.json({ result: 1, user: doc })
      })

    }
  })
}

router.loginForAP = function (req, res) {
  var token = rack()
  user.findOne({ account: req.body.account, password: req.body.password }, function (err, doc) {
    if (err) console.log(err)
    if (doc == null) {
      res.json({ result: 0, msg: '未找到该用户' })
    } else {
      res.json({ result: 1, user: doc })
    }
  })
}

router.loginForQQ = function (req, res) {
  var account = req.body.account;
  var model = user(req.body)
  user.findOne({ 'account': account }, function (err, doc) {
    if (err) console.log(err)
    if (doc == null) {
      model.save(function (err, user) {
        if (err) console.log(err)
        res.json(user)
      })
    } else {
      var newToken = rack()
      user.updateOne({ 'account': account }, { 'token': newToken }, function (err) {
        doc.token = newToken;
        res.json(doc)
      })
    }
  })
}

router.like = function (req, res) {
  var userId = req.query.userId
  var trendId = req.query.trendId
  trend.findOne({ '_id': trendId }, function (err, t) {
    if (err) console.log(err)
    if (t.likeIds.indexOf(userId) == 0) {
      trend.updateOne({ '_id': trendId }, { $pull: { 'likeIds': userId },$inc:{'likes':-1} }, function (err, doc) {
        if (err) console.log(err)
        res.json(doc)
      })
    } else {
      trend.updateOne({ '_id': trendId }, { $push: { 'likeIds': userId },$inc:{'likes':1} }, function (err, doc) {
        if (err) console.log(err)
        res.json(doc)
      })
    }
  })
}
router.getToday = function(req,res){
  var end = new Date().getTime()
  var mSecond = 24*3600*1000
  // var days = end%mSecond
  var start = end - end%mSecond
  console.log(start)
  console.log(end)
  
  trend.find({created:{$gte:start,$lte:end}},function(err,docs){
    if (err) console.log(err)
    res.json(docs)
  }).sort({'likes':-1}).limit(10).populate('fromId').exec()
}

router.getWeekend = function(req,res){
  var end = new Date().getTime()
  var mSecond = 24*3600*1000*7
  // var day = new Date().getDay()
  // var days = Math.round(end/mSecond)
  // var start = (days-day)*mSecond
  var start = end - end%mSecond
  console.log(start)
  trend.find({created:{$gte:start,$lte:end}},function(err,docs){
    if (err) console.log(err)
    res.json(docs)
  }).sort({'likes':-1}).limit(10).populate('fromId').exec()
}

router.getMonth = function(req,res){
  var end = new Date().getTime()
  var date = new Date().getDate()
  var mSecond = 24*3600*1000
  var days = Math.floor(end/mSecond)
  var start = (days-date+1)*mSecond

  trend.find({created:{$gte:start,$lte:end}},function(err,docs){
    if (err) console.log(err)
    res.json(docs)
  }).sort({'likes':-1}).limit(10).populate('fromId').exec()
}


router.getMyTrend = function(req,res){
  var userId = req.query.userId
  trend.find({'fromId':userId},function(err,docs){
    if (err) console.log(err)
    res.json(docs)
  }).sort({'created':-1}).populate('fromId').exec()
}

router.commitFeedback = function(req,res){
  var feedbackModel = feedback(req.body);
  feedbackModel.save(function(err,doc){
    if (err) console.log(err)
    res.json('反馈成功')
  })

}

module.exports = router;
