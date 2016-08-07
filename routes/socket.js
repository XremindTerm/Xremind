/**
 * Created by jack on 8/7/16.
 */

var socket_io = require("socket.io");
var io = socket_io();
// module.exports = function (io) {
//     var app = require('express');
//     var router = app.Router();
//
//     io.on('connection', function (socket) {
//         console.log('A user is in')
//
//         socket.on('disconnect', function (msg) {
//             console.log('A user is leave')
//         })
//     });
//
//     return router;
// };

module.exports = function (io) {
    io.on('connect', function (socket) {
        console.log('A new user is in');
        socket.on('login', msg)
    })
};