var express=require('express');
var router=express.Router();
var query=require('dao/dbPool');

var echoReminderKeys=['id','data','status','create','target'];

function Out(req,res,defaultView){
	return {
		_req:req,
		_res:res,
		_view:defaultView,
		echo:function(obj,view){
			if(this._req.is('json')){
				this._res.jsonp(obj);
			}else{
				this._res.render(view||this._view,obj);
			}
		}
	}
}

// All reminders listening
router.all('/',function(req,res,next){
	res.redirect('list');
});

// add new reminders
router.route('/add')
	.get(function(req,res,next){
		res.render('edit');
	})
	.post(function(req,res,next){
		var out=Out(req,res,'index');
		if(req.body.data&&req.body.data.trim().length>2){
			var tD=new Date();tD.setHours(4);tD.setMinutes(0);tD.setSeconds(0);
			var values=[
				['uid','data','target','interval','status','create'],
				req.session.userinfo.id,
				req.body.data.trim(),
				tD.getTime(),
				1000*60*60*24,
				'action',
				new Date().getTime()
			];
			query('insert into reminders (??) values(?,?,?,?,?,?)',values,function(err,vals){
				if(err){
					out.echo({state:'err',detail:err});
				}else{
					out.echo({state:'ok',detail:'create reminder success'});
				}
			});
		}else{
			out.echo({state:'err',detail:'Invaild Param Data'});
		}
	});

// list reminders
router.all('/list',function(req,res,next){
	var out=Out(req,res,'index');
	var values=[echoReminderKeys,req.session.userinfo.id];
	query('select ?? from reminders where uid = ?',values,function(err,vals){
		if(err){
			out.echo({state:'err',detail:err});
		}else{
			var obj={};
			for(var i=0,l=vals.length;i<l;i++){
				if(vals[i]){
					obj[vals[i].id||i]=vals[i];
				}
			}
			out.echo({state:'ok',detail:'list reminder success',reminders:obj});
		}
	});
});

var RPID=setInterval(function(){
	console.log('开始分析记忆任务');
	var nT=new Date().getTime();
	/*
		逻辑分析：
			if nT>=target and status="doing" then target+=interval
	*/
		var vaildCondition=" where `target`<="+nT+" and `status`='doing'";
		//选出已经生效的提醒，创建对应的报告
		query('insert into reports (`rid`,`uid`,`fulfill`)'
				+' select `id`,`uid`,"'+nT+'" from reminders'+vaildCondition
			,function(err){
				if(err){console.log(err.stack||err);return;}
				console.log('创建对应的报告成功');
				//推送已经生效的提醒
				query('select ?? from reminders'+vaildCondition,[echoReminderKeys],function(err,vals){
					if(err){console.log(err.stack||err);return;}

					/*推送Code*/
					console.log('推送已经生效的提醒成功');

					//更新已经生效的提醒
					query('update reminders set `target`=`target`+`interval`'+vaildCondition,function(err){
						if(err)console.log(err.stack||err);
						console.log('更新已经生效的提醒成功');
						console.log('分析结束');
					});
				});
		});
},1000*60);
console.log("记忆任务更新进程PID："+RPID._idleStart);

module.exports = router;
