const date = require('date-and-time');
const { postChatMessage, getChatHistoric } = require('../models/chatModel');

const onlineUsers = {};

const joinChat = async ({ socket, nickname, io }) => {
  onlineUsers[socket.id] = nickname;
  const chatHistoric = await getChatHistoric();
  chatHistoric.forEach((msg) => {
  const formatedTimestamp = date.format(msg.timestamp, 'DD-MM-YYYY HH:mm:ss');
    socket.emit('message', `${formatedTimestamp} - ${msg.nickname}: ${msg.message}`);
  });

  // socket.broadcast.emit: Emite a msg pata TODOS, MENOS para o socket que se conectou
  socket.broadcast.emit('message', `${nickname} acabou de se conectar`);
  io.emit('onlineUser', onlineUsers);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('joinChat', ({ nickname }) => joinChat({ socket, nickname, io }));

  socket.on('message', async ({ chatMessage, nickname }) => {
    // Source: https://www.geeksforgeeks.org/node-js-date-format-api/
    const value = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss');

    // io.emit: Emite a msg pata TODOS os sockets conectados
    io.emit('message', `${value} - ${nickname}: ${chatMessage}`);

    await postChatMessage({ message: chatMessage, nickname });
  });

  socket.on('userNameUpdate', (newNickname) => {
    onlineUsers[socket.id] = newNickname;
    io.emit('onlineUser', onlineUsers);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `${onlineUsers[socket.id]} se desconectou!`);
    delete onlineUsers[socket.id];
    socket.broadcast.emit('onlineUser', onlineUsers);
  });
});