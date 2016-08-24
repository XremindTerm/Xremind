var userList = {};
module.exports.socket = function (io) {
    var app = require('express');
    var router = app.Router();
    io.on('connection', function (socket) {
        console.log("New client is connected(id =" + socket.id + ")");
        //使用sock.io.handshake.获取session
        if (socket.handshake.session.userinfo.nickname) {
            var nickname = socket.handshake.session.userinfo.nickname || '';
        }

        //强制更新
        userList[nickname] = socket;
        socket.on('disconnect', function (msg) {
            console.info('Client gone (id=' + socket.id + ').');
            delete userList[nickname];
        })
    });

    return router;
};

module.exports.userlist = userList;