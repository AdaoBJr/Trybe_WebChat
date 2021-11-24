const moment = require('moment');
const controller = require('../controllers/chatControllers');

let users = [];

module.exports = (io) => io.on('connection', (socket) => {
  users.push({ nickname: socket.id.slice(0, 16), socketId: socket.id });
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
    users = users.filter((elem) => elem.socketId !== socket.id); 
    io.emit('listedUsers', users);
  });
});
