var express = require('express');
var router = express.Router();
var query = require('dao/dbPool');
var Out = require('./out');
var shortid = require('shortid');
var socket = require('dao/push');

var echoKeys = ['shortid', 'data', 'target', 'create', 'status'];

// All reminders listening
router.all('/', function (req, res, next) {
    res.redirect('/reminder/list/action');
});

// add new reminders
router.route('/add')
    .get(function (req, res, next) {
        res.render('edit');
    })
    .post(function (req, res, next) {
        var out = Out(req, res, 'index');
        if (req.body.data && req.body.data.trim().length > 2) {
            if (req.body.shortid.length == 0) {
                var tD = new Date();
                tD.setHours(4);
                tD.setMinutes(0);
                tD.setSeconds(0);
                var data = {
                    shortid: shortid.generate(),
                    uid: req.session.userinfo.id,
                    data: decodeURIComponent(req.body.data.trim()),
                    target: tD.getTime(),
                    interval: 1000 * 60 * 60 * 24,
                    status: 'wait',
                    create: new Date().getTime()
                };
                query('insert into reminders set ?', data, function (err, vals) {
                    if (err) {
                        out.echo({ state: 'err', detail: err });
                    } else {
                        out.echo({ state: 'ok', detail: 'create reminder success' });
                    }
                });
            } else {
                var data = {
                    data: req.body.data.trim(),
                };
                query('update reminders set ? where uid = ? and shortid = ? limit 1'
                    , [data, req.session.userinfo.id, req.body.shortid], function (err) {
                        if (err) {
                            out.echo({ state: 'err', detail: err });
                        } else {
                            out.echo({ state: 'ok', detail: 'update reminder success' });
                        }
                    });
            }
        } else {
            out.echo({ state: 'err', detail: 'Invaild Param Data' });
        }
    });

// list reminders
router.all('/list/:nav', function (req, res, next) {
    var nav = req.params.nav || 'action';
    var out = Out(req, res, 'index', {
        nav: nav
    });
    query('select ?? from reminders where uid = ? and status = ?', [echoKeys, req.session.userinfo.id, nav], function (err, vals) {
        if (err) {
            out.echo({ state: 'err', detail: err });
        } else {
            if (vals.length > 0) {
                var obj = {};
                for (var i = 0, l = vals.length; i < l; i++) {
                    if (vals[i]) {
                        try {
                            vals[i].data = JSON.parse(vals[i].data);
                        } catch (e) {
                        }
                        obj[vals[i].shortid || i] = vals[i];
                    }
                }
                out.echo({ state: 'ok', detail: 'list reminder success', reminders: vals });
            } else {
                out.echo({ state: 'err', detail: 'NOTE：暂无任务' });
            }
        }
    });
});

router.all('/:shortid', function (req, res, next) {
    var out = Out(req, res, 'edit');
    query('select ?? from reminders where uid = ? and shortid = ? limit 1'
        , [echoKeys, req.session.userinfo.id, req.params.shortid]
        , function (err, vals) {
            if (err) {
                out.echo({ state: 'err', detail: err });
            } else {
                if (vals[0]) {
                    try {
                        vals[0].data = JSON.parse(vals[0].data);
                    } catch (e) {
                    }
                    out.echo({ state: 'ok', detail: 'get reminder success', reminder: vals[0] });
                } else {
                    out.echo({ state: 'err', detail: 'cannot find the reminder' });
                }
            }
        });
});

var RPID = setInterval(function () {
    console.log('开始分析记忆任务');
    var nT = new Date().getTime();
    /*
     事件驱动逻辑分析：
     [action]=>[wait]
     @conditions:event 记住了
     @modify:status=wait,target+=interval,reports status=ok
     @conditions:event 需加强
     @modify:status=wait,target+=interval,reports status=enhance
     [action]=>[done]
     @conditions:event 完成
     @modify:status=done
     [action]=>[delete]
     @conditions:event 删除
     @modify:delete thsi reminder
     */

    /**
     * [action]=>[wait]
     * @conditions:target-nT >=1000*60*60*12 && status=action //超时
     * @modify:status=wait,target+=interval,reports status=undone
     */
    console.log('重置超时任务');    
    var outTimeCondition = " where " + nT + "-`target`>=43200000 and `status`='action'";
    query("update `reminders` set `status`='wait',`target`=`target`+`interval`" + outTimeCondition, function (err) {
        if (err) {
            console.log(err.stack || err);
            return;
        }
        //因为reports的status默认为undone，所以无需操作
    });

    /**
     * [wait]=>[action]
     * @conditions:target<=nT && status=wait
     * @modify:status=action,add into table `reports`
     */
    console.log('初始化新任务的报告');
    var vaildCondition = " where `target`<=" + nT + " and `status`='wait'";
    //选出已经生效的提醒，创建对应的报告
    query("insert into reports (`rid`,`uid`,`fulfill`)"
        + " select `id`,`uid`,'" + nT + "' from reminders" + vaildCondition
        , function (err) {
            if (err) {
                console.log(err.stack || err);
                return;
            }

            //推送新任务的提醒
            console.log('推送新任务的提醒');
            query("select ?? from reminders" + vaildCondition,[echoKeys], function (err, vals) {
                if (err) {
                    console.log(err.stack || err);
                    return;
                }
                if(vals.length>0){//进行推送
                    var pushList={};
                    for(var i=0,l=vals.length;i<l;i++){
                        if(pushList[vals[i].uid]){
                            pushList[vals[i].uid].push(vals[i]);
                        }else{
                            pushList[vals[i].uid]=[vals[i]];
                        }
                    }
                    socket.push(pushList, function (err, result) {
                        if (err) {
                            console.log(result);
                        } else {
                            //Succeed
                            //return result model like userList
                            //TODO
                        }
                    });
                }
                
                //更新已经生效的提醒
                console.log('激活新任务');
                query("update reminders set `status`='action'" + vaildCondition, function (err) {
                    if (err) console.log(err.stack || err);
                });
            });
        });
}, 1000 * 60);
console.log("记忆任务更新进程PID：" + RPID._idleStart);

module.exports = router;