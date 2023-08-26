import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('new-user', 'Alice');
  setTimeout(() => {
    socket.emit('send-chat-message', { name: 'Alice', message: 'Hello, everyone!' });
  }, 1000);
});

socket.on('user-connected', (name: string) => {
  console.log(`User connected: ${name}`);
});

socket.on('chat-message', (data: { name: string; message: string }) => {
  console.log(`${data.name}: ${data.message}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
