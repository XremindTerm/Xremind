var express=require('express');
var router=express.Router();
var query=require('dao/dbPool');
var Out=require('./out');
var shortid=require('shortid');

var echoKeys=['shortid','data','target','create','status'];

// All reminders listening
router.all('/',function(req,res,next){
    res.redirect('/reminder/list/action');
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
router.all('/list/:nav',function(req,res,next){
    var nav=req.params.nav||'action';
    var out=Out(req,res,'index',{
        nav:nav
    });
    query('select ?? from reminders where uid = ? and status = ?',[echoKeys,req.session.userinfo.id,nav],function(err,vals){
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
    query('select ?? from reminders where uid = ? and shortid = ? limit 1'
        ,[echoKeys,req.session.userinfo.id,req.params.shortid]
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
            query('select ?? from reminders'+vaildCondition,[echoKeys],function(err,vals){
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