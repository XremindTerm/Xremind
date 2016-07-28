var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(res.session.userinfo){
  	res.render('index', { title: 'Express' });
	}else{
		res.redirect('/user/login');
	}
});

module.exports = router;
