const moment = require('moment');
const { sendMessage } = require('../models/messagesModel');

let usersBox = [];

function geraStringAleatoria(tamanho) {
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tamanho; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}

module.exports = (io) => io.on('connection', async (socket) => {
  usersBox.push({ nickname: geraStringAleatoria(16), socketId: socket.id });

  io.emit('usersList', usersBox);
  const datetime = moment().format('DD-MM-YYYY HH:mm:ss');
  socket.on('message', async ({ chatMessage, nickname }) => {
    await sendMessage({ message: chatMessage, nickname, datetime });
    io.emit('message', `${datetime} - ${nickname}: ${chatMessage}`);
  });

  socket.on('changeNick', (nickname) => {
    usersBox = usersBox.map((user) => {
      if (user.socketId === socket.id) return { ...user, nickname };
      return user;
    });
    io.emit('usersList', usersBox);
  });

  socket.on('disconnect', () => {
    usersBox = usersBox.filter((user) => user.socketId !== socket.id);
  io.emit('usersList', usersBox);
  });
});
