var express = require('express');
var router = express.Router();
var query=require('dao/dbPool');
var md5=require('md5');

/* GET user listing. */
router.get('/', function(req, res, next) {
  if(req.session.userinfo){
  	res.redirect('/');
  }else{
  	res.render('login');
  }
});


function Out(req,res,defaultView,defaultViewOpt){
	return {
		_req:req,
		_res:res,
		_view:defaultView,
		_opt:defaultViewOpt,//渲染所需的默认参数，参数可被echo中的obj中覆盖
		echo:function(obj,view){
			if(this._req.is('json')){
				this._res.jsonp(obj);
			}else{
				this._opt.json=obj;
				this._res.render(view||this._view,this._opt);
			}
		}
	}
}

router.route('/login')
	.get(function(req, res, next) {
		if(req.session.userinfo){
			res.redirect('/');
	  }else{
	  	var nickname=req.cookies.nickname;
	  	var img='/img/default.png';
	  	query('select img from users where nickname = ? limit 1',[nickname],function(err,vals){
	  		if(!err){if(vals[0]&&vals[0].img)img=vals[0].img;}
	  		res.render('auth',{
		  		form:{
		  			action:'/user/login',
		  			nickname:nickname,
		  			img:img,
		  			submit:'Go'
		  		},
		  		aLink:{
		  			text:'注册',
		  			href:'register'
		  		}
		  	});
	  	});
	  	
	  }
	})
	.post(function(req,res,next){
		if(req.body.nickname&&req.body.nickname.length>=4
				&&req.body.password&&req.body.password.length>=4){
			query('select * from users where nickname = ? limit 1'
					,[req.body.nickname],function(err,vals){
				var out=Out(req,res,'auth',{
					form:{
			  			action:'/user/login',
			  			nickname:req.body.nickname,
			  			img:'/img/default.png',
			  			submit:'Go'
			  		},
			  		aLink:{
			  			text:'注册',
			  			href:'register'
			  		}
				});
				if(err){
					out.echo({state:'err',detail:err});
				}else{
					if(vals[0]&&vals[0].img)out._opt.form.img=vals[0].img;
					if(vals[0]&&vals[0].password==md5(req.body.password)){
						vals[0].password="*";
						req.session.userinfo=vals[0];
						res.cookie('nickname', vals[0].nickname, { maxAge: 604800000, httpOnly: true })
						out.echo({state:'ok',detail:'login success'});
					}else{
						out.echo({state:'err',detail:'Incorrect password'});
					}
				}
			});
		}else{
			out.echo({state:'err','detail':'Lost Params or Unstandard params.'});
		}
	});

function logout(req,res,next){
	delete req.session.userinfo;
	var out=Out(req,res,'login');
	out.echo({state:'ok',detail:'logout success'});
}
router.route('/logout')
	.get(logout)
	.post(logout);

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
			var out=Out(req,res,'register');
			req.body.nickname=req.body.nickname.trim();
			req.body.password=md5(req.body.password.trim());
			query('select usermail from users where usermail = ? or nickname = ? limit 1'
					,[req.body.usermail,req.body.nickname],function(err,vals){
				if(err){
					out.echo({state:'err',detail:err});
				}else{
					if(vals.length>0){
						var t=(vals[0].usermail==req.body.usermail)?'Mail':'Nickname';
						out.echo({state:'err',detail:'The '+t+' had Existed'});
					}else{
						query('insert into users (usermail,nickname,password) values(?,?,?)',
								[req.body.usermail,req.body.nickname,req.body.password],function(err){
							if(err){
								out.echo({state:'err',detail:'err'});
							}else{
								out.echo({state:'ok',detail:'register success',nickname:req.body.nickname},'login');
							}
						});
					}
				}
			});
		}else{
			out.echo({state:'err','detail':'Lost Params or Unstandard params.'});
		}
	});

module.exports = router;