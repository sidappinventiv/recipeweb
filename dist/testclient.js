"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const socket = (0, socket_io_client_1.default)('http://localhost:3000');
socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('new-user', 'Alice');
    setTimeout(() => {
        socket.emit('send-chat-message', { name: 'Alice', message: 'Hello, everyone!' });
    }, 1000);
});
socket.on('user-connected', (name) => {
    console.log(`User connected: ${name}`);
});
socket.on('chat-message', (data) => {
    console.log(`${data.name}: ${data.message}`);
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
