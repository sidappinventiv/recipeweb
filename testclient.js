"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_client_1 = require("socket.io-client");
var socket = (0, socket_io_client_1.default)('http://localhost:3000');
socket.on('connect', function () {
    console.log('Connected to server');
    // Send a new user event
    socket.emit('new-user', 'Alice');
    // Send a chat message event
    setTimeout(function () {
        socket.emit('send-chat-message', { name: 'Alice', message: 'Hello, everyone!' });
    }, 1000);
});
socket.on('user-connected', function (name) {
    console.log("User connected: ".concat(name));
});
socket.on('chat-message', function (data) {
    console.log("".concat(data.name, ": ").concat(data.message));
});
socket.on('disconnect', function () {
    console.log('Disconnected from server');
});
