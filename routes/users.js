var express = require('express');
var router = express.Router();
var query=require('dao/dbPool');
var md5=require('md5');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.userinfo){
  	res.redirect('/');
  }else{
  	res.redirect('login');
  }
});

router.route('/login')
	.get(function(req, res, next) {
		if(req.session.userinfo){
	  	res.redirect('/');
	  }else{
	  	res.render('login');
	  }
	})
	.post(function(req,res,next){
		if(req.body.nickname&&req.body.nickname.length>=4
				&&req.body.password&&req.body.password.length>=4){
			query('select * from users where nickname = ? limit 1'
					,[req.body.nickname],function(err,vals){
				if(err){
					res.jsonp({state:'err',detail:err});
				}else{
					if(vals[0]===undefined){
						res.jsonp({state:'err','detail':'Cannot find the user.'});
					}else{
						if(vals[0].password==md5(req.body.password)){
							vals[0].password="*";
							req.session.userinfo=vals[0];
							res.jsonp({state:'ok',detail:'login success'});
							//res.redirect('/');
						}else{
							res.jsonp({state:'err',detail:'Incorrect password'});
						}
					}
				}
			});
		}else{
			res.jsonp({state:'err','detail':'Lost Params or Unstandard params.'});
		}
	});

router.route('/register')
	.get(function(req,res,next){
		if(req.session.userinfo){
	  	res.redirect('/');
	  }else{
	  	res.render('register');
	  }
	})
	.post(function(req,res,next){
		if(req.body.nickname&&req.body.nickname.trim().length>=4
				&&req.body.password&&req.body.password.trim().length>=4
				&&(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(req.body.usermail))){
			req.body.nickname=req.body.nickname.trim();
			req.body.password=md5(req.body.password.trim());
			query('select usermail from users where usermail = ? or nickname = ? limit 1'
					,[req.body.usermail,req.body.nickname],function(err,vals){
				if(err){
					res.jsonp({state:'err',detail:err});
				}else{
					if(vals.length>0){
						var t=(vals[0].usermail==req.body.usermail)?'Mail':'Nickname';
						res.jsonp({state:'err',detail:'The '+t+' had Existed'});
					}else{
						query('insert into users (usermail,nickname,password) values(?,?,?)',
								[req.body.usermail,req.body.nickname,req.body.password],function(err){
							if(err){
								res.jsonp({state:'err',detail:'err'});
							}else{
								res.jsonp({state:'ok',detail:'register success'});
								//res.redirect('login');
							}
						});
					}
				}
			});
		}else{
			res.jsonp({state:'err','detail':'Lost Params or Unstandard params.'});
		}
	});

module.exports = router;