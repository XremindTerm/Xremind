var express = require('express');
var nunjucks = require('nunjucks');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var user = require('./routes/user');
var reminder = require('./routes/reminder');

var app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// error handlers

// development error handler

// will print stacktrace
app.io = require('socket.io')();

app.set('view engine', 'html');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({
    secret: 'Xremind',
    name: 'xid',
    cookie: {maxAge: 600000},//设置session十分钟后过期
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/user', user);
app.use('/reminder', reminder);
app.use('/reminder', require('./node_modules/dao/socket').socket(app.io));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('error', {
        statusCode: res.statusCode,
        message: err.message,
        error: err
    });
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            statusCode: res.statusCode,
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        statusCode: res.statusCode,
        message: err.message,
        error: err
    });
});
module.exports = app;


// production error handler
// no stacktraces leaked to user
