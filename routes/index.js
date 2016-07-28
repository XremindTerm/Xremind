var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.userinfo){
		res.render('index', { title: 'Express' });
	}else{
		res.redirect('/user');
	}
});

module.exports = router;
