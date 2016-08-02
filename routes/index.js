var express = require('express');
var router = express.Router();

//User Auth Check
router.all('*', function (req, res, next) {
    var reg = /^\/user(\/|\/login|\/register|\/img\/.+)?$/;
    if (!req.session.userinfo && !reg.test(req.originalUrl)) {
        if (req.is('json')) {
            res.jsonp({state: 'err', detail: 'please login first'});
        } else {
            res.redirect('/user');
        }
    } else next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.userinfo) {
        res.render('index', {title: 'Express'});
    } else {
        res.redirect('index');
    }
});

module.exports = router;
