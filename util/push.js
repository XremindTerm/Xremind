module.exports.push = function (users, callback) {
    //判断传入的数据是否是对象
    if ((typeof users) != 'object') {
        if (callback && typeof(callback) == 'function') {
            callback(false, 'please send a object to me :)');
        }
        return false;
    }
    
    var badUser=users;
    var sendflag = false;
    //获取在线的全部用户
    var userAllList = require('./socket').userlist;
    var query = require('./dbPool');

    //取出用户任务详情
    for (var key in users) {
        for (var i, l = users[key]; i < l.length; i++) {
            query('select shortid,data from reports where rid = ?', [l[i]], function (err, vals) {
                l[i] = vals[0];
            })
        }
    }

    //确定在线用户列表，开始消息推送
    for (var u_push in users) {
        for (var name in userAllList) {
            if (name.toString() == u_push.toString()) {
                //解析任务详情，逐条推送
                for (var t; t < users[u_push], length; t++) {
                    userAllList[name].emit('chatBack', users[u_push][t])
                }
                //删除成功推送的，即为失败推送的
                delete badUser[u_push];
                break;
            }
        }
        sendflag = true;
    }

    //回调事件
    if (callback && typeof(callback) == 'function') {
        if (sendflag) {
            callback(false, badUser);
        } else {
            callback(true, 'Socket connect error,please wait a monent');
        }
    }
}