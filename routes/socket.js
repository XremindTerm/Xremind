/**
 * Created by jack on 8/7/16.
 */
var io = require('socket.io')();
var userList = {};

module.exports.socket = function (io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function (socket) {
        console.log("A user is in");
        var socketID = socket.id;
        var nickname = '';

        socket.on('chatBack', function (msg) {
            console.log(msg);
            // 判断用户是否加入
            console.log(msg.nickname);
            if (!userList.hasOwnProperty(msg.nickname)) {
                userList[msg.nickname] = socketID;
            }
            console.log('__________++________');
            console.log(userList);
        });


        socket.on('disconnect', function (msg) {
            console.log('a user is leave');
            if (userList.hasOwnProperty(msg.nickname)) {
                delete userList[msg.nickname];
            }

        })

    });


    return router;
};


module.exports.push = function (username, msgs, callback) {

    var sendflag = false;
    console.log(userList);
    for (var name in userList) {
        if (username == name) {
            console.log(userList[name]);
            io.to(userList[name]).emit(msgs);
            // io.sockets.socket(userList[name]).emit('chatBack', msgs)
            // io.socket.connected[userList[name]].emit('chatBack', msgs);
            sendflag = true;
        }
    }
    if (callback && typeof(callback) == 'function') {
        if (sendflag) {
            callback(false, 'push is finished');
        } else {
            callback(true, 'user no found or socket connet error')
        }
    }
};
