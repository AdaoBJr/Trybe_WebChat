const moment = require('moment');
const controller = require('../controllers/chatControllers');

let users = [];

module.exports = (io) => io.on('connection', (socket) => {
  const newNickname = socket.id.slice(0, 16);
  users.push({ nickname: newNickname, socketId: socket.id });
  // socket.emit('message', 'Bem vindos ao TrybeChat!');
  // socket.broadcast.emit('message', `${socket.id} Entrou no chat`);
  // socket.on('disconnect', () => {
  //   io.emit('message', `${socket.id} Saiu do chat`);
  // });
  // Trocar o nickname
  io.emit('listedUsers', users);
  socket.on('changedNickname', (nickname) => {
    users = users.map((elem) => {
      if (elem.socketId === socket.id) return { ...elem, nickname };
      return elem;
    });
    io.emit('listedUsers', users);
  });
  // Escutando mensagem dos usuários
  const timeStamp = moment().format('DD-MM-yyyy LTS');
  socket.on('message', async ({ chatMessage, nickname }) => {
    await controller.saveMessage({ message: chatMessage, nickname, timeStamp });
    io.emit('message', `${timeStamp} - ${nickname}: ${chatMessage}`);
  });
  socket.on('disconnect', () => { 
    users = users.filter((user) => user.socketId !== socket.id); io.emit('listUsers', users);
  });
});

// `<div class="message-data">
      // <span class="message-data-name"><i class="fa fa-circle online"></i> ${socket.id}</span>
      // <span class="message-data-time"> ${timeStamp} </span>
      // </div>
      // <div class="message my-message">
      //   ${message}.
      // </div>` teste