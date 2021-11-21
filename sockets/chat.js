const date = require('date-and-time');
const { postChatMessage, getChatHistoric } = require('../models/chatModel');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('joinChat', async ({ nickname }) => {
    // socket.emit: Emite a msg SOMENTE para o socket que se conectou
    // socket.emit('message', 'Olá, seja bem vindo ao nosso chat');

    const chatHistoric = await getChatHistoric();

    chatHistoric.forEach((msg) => {
    const formatedTimestamp = date.format(msg.timestamp, 'DD-MM-YYYY HH:mm:ss');

      socket.emit('message', `${formatedTimestamp} - ${msg.nickname}: ${msg.message}`);
    });

    // socket.broadcast.emit: Emite a msg pata TODOS, MENOS para o socket que se conectou
    socket.broadcast.emit('message', `${nickname} acabou de se conectar`);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    // Source: https://www.geeksforgeeks.org/node-js-date-format-api/
    const now = new Date();
    const value = date.format(now, 'DD-MM-YYYY HH:mm:ss');

    // io.emit: Emite a msg pata TODOS os sockets conectados
    io.emit('message', `${value} - ${nickname}: ${chatMessage}`);

    await postChatMessage({ message: chatMessage, nickname });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `${socket.id} se desconectou!`);
  });
});