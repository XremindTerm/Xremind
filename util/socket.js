var userList = {};
module.exports.socket = function (io) {
    var app = require('express');
    var router = app.Router();
    io.on('connection', function (socket) {
        console.log("New client is connected(id =" + socket.id + ")");
        var nickname = '';

        socket.on('init', function (msg) {
            nickname = msg.nickname.toString();
            if (!userList.hasOwnProperty(nickname)) {
                userList[nickname] = socket;
            }
        });


        socket.on('disconnect', function (msg) {
            console.info('Client gone (id=' + socket.id + ').');
            delete userList[nickname];
        })
    });

    return router;
};

module.exports.userlist = userList;