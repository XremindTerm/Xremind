/**
 * Created by jack on 8/7/16.
 */
//
// module.exports = function (io) {
//     io.on('connect', function (socket) {
//         console.log('A new user is in');
//         socket.on('login', msg)
//     })
// };
var io = require('socket.io')();
var userList = {};

module.exports.socket = function (io) {
    var app = require('express');
    var router = app.Router();

    io.on('connection', function (socket) {
        console.log("A user is in");
        var socketID = socket.id;
        var nickname = '';

        socket.on('init', function (msg) {
            console.log(msg);
            //判断用户是否加入
            if (!userList.hasOwnProperty(msg.nickname)) {
                userList[msg.nickname] = socketID;
            }
            console.log(userList);
            console.log("_____________+++_________________")
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

module.exports.pushMsg = function (username, msgs, callback) {
    var sendflag = false;
    var io = require('socket.io')();
    io.on('connection', function (socket) {
        for (var name in userList) {
            if (username == name) {
                socket.to(userList[name]).emit('chatBack', msgs);
                sendflag = true;
            }
        }
        if (callback && typeof(callback) == 'function') {
            if (sendflag) {
                callback('ok', 'push is finished');
            } else {
                callback('err', 'user no found or socket connet error')
            }
        }
    })
};