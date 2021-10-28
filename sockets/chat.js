const { dateNow } = require('../helper/date');

const foundUser = (id, pessoas) => {
  let indexFound = 0;
  pessoas.forEach((pessoa, index) => {
    if (pessoa.id === id) {
      indexFound = index;
    }
  });
  return indexFound;
};

const pessoas = [];
 module.exports = (io) => io.on('connection', (socket) => {
  socket.on('userOn', (nickname) => {
    pessoas.push({ nickname, id: socket.id });
    io.emit('userOn', pessoas);
  });

  socket.on('disconnect', () => {
    if (pessoas[foundUser(socket.id, pessoas)] !== undefined) {
      socket.broadcast.emit('userOff', pessoas[foundUser(socket.id, pessoas)].nickname);
      pessoas.splice(foundUser(socket.id, pessoas), 1);
    }
  });

  socket.on('updateUserOn', (name) => {
    io.emit('updateUserOn', { 
      newName: name, pastName: pessoas[foundUser(socket.id, pessoas)].nickname });
    pessoas[foundUser(socket.id, pessoas)] = { nickname: name, id: socket.id };
  });

  socket.on('message', (message) => {
    io.emit('message', `${dateNow()} - ${message.nickname}: ${message.chatMessage}`);
  });
});