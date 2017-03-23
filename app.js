var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

var server = require('http').createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//禁掉etag 304错误
app.disable('etag');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);

app.post('/save',index.save)
app.get('/recentTrends',index.loadTrend)
app.post('/uploadTrend',index.uploadTrend)
app.post('/pubComment',index.pubComment)
app.post('/register',index.register)
app.post('/login',index.login)
app.post('/loginForAP',index.loginForAP)
app.post('/qqLogin',index.loginForQQ)
app.get('/like',index.like)
app.get('/getComments',index.getComments)
app.get('/getToday',index.getToday)
app.get('/getWeekend',index.getWeekend)
app.get('/getMonth',index.getMonth)
app.get('/getMyTrend',index.getMyTrend)
app.post('/commitFeedback',index.commitFeedback)
app.post('/uploadVersion',index.uploadVersion)
app.get('/getVersion',index.getVersion)
app.post('/checkUser',index.checkUser)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000, function () {
    console.log('server listening port 3000');
})
