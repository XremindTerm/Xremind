var express=require('express');
var router=express.Router();
var query=require('dao/dbPool');
var Out=require('./out');
var shortid=require('shortid');

// All reminders listening
router.all('/',function(req,res,next){
	res.redirect('/reminder/list');
});

// add new reminders
router.route('/add')
	.get(function(req,res,next){
		res.render('edit');
	})
	.post(function(req,res,next){
		var out=Out(req,res,'index');
		if(req.body.data&&req.body.data.trim().length>2){
			if(req.body.shortid.length==0){
				var tD=new Date();tD.setHours(4);tD.setMinutes(0);tD.setSeconds(0);
				var data={
					shortid:shortid.generate(),
					uid:req.session.userinfo.id,
					data:decodeURIComponent(req.body.data.trim()),
					target:tD.getTime(),
					interval:1000*60*60*24,
					status:'action',
					create:new Date().getTime()
				};
				query('insert into reminders set ?',data,function(err,vals){
					if(err){
						out.echo({state:'err',detail:err});
					}else{
						out.echo({state:'ok',detail:'create reminder success'});
					}
				});
			}else{
				var data={
					data:req.body.data.trim(),
				};
				query('update reminders set ? where uid = ? and shortid = ? limit 1'
				,[data,req.session.userinfo.id,req.body.shortid],function(err){
					if(err){
						out.echo({state:'err',detail:err});
					}else{
						out.echo({state:'ok',detail:'update reminder success'});
					}
				});
			}
		}else{
			out.echo({state:'err',detail:'Invaild Param Data'});
		}
	});

// list reminders
router.all('/list',function(req,res,next){
	var out=Out(req,res,'index');
	var keys=['shortid','data','target','create','status'];
	query('select ?? from reminders where uid = ?',[keys,req.session.userinfo.id],function(err,vals){
		if(err){
			out.echo({state:'err',detail:err});
		}else{
			if(vals.length>0){
				var obj = {};
	            for (var i = 0, l = vals.length; i < l; i++) {
	                if (vals[i]) {
	                    try{
	                        vals[i].data=JSON.parse(vals[i].data);
	                    }catch (e){}
	                    obj[vals[i].shortid || i] = vals[i];
	                }
	            }
	            console.log(JSON.stringify(vals));
				out.echo({state:'ok',detail:'list reminder success',reminders:vals});
			}else{
				out.echo({state:'err',detail:'NOTE：暂无任务'});
			}
		}
	});
});

router.all('/:shortid',function(req,res,next){
	var out=Out(req,res,'edit');
	var keys=['shortid','data','target','create','status'];
	query('select ?? from reminders where uid = ? and shortid = ? limit 1'
	,[keys,req.session.userinfo.id,req.params.shortid]
	,function(err,vals){
		if(err){
			out.echo({state:'err',detail:err});
		}else{
            if (vals[0]) {
                try{
                    vals[0].data=JSON.parse(vals[0].data);
                }catch (e){}
                out.echo({state:'ok',detail:'get reminder success',reminder:vals[0]});
            }else{
            	out.echo({state:'err',detail:'cannot find the reminder'});
            }
		}
	});
});

module.exports = router;
