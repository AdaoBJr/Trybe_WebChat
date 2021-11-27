const crypto = require('crypto');
const model = require('../models/data');

const generateUserName = () => crypto.randomBytes(8).toString('hex');
const users = {};

module.exports = (io) => io.on('connection', async (socket) => {
  const getMessages = await model.getAllMessages();
  socket.emit('histories', getMessages);
  users[socket.id] = generateUserName();
  if (socket.connected) {
    socket.emit('joined', users);
  }
  
  socket.broadcast.emit('newUser', users);
  
  socket.on('updateNick', ({ nickname, socketId }) => {
    users[socketId] = nickname;
    io.emit('changeAllNick', users);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', await model.createMessage({ chatMessage, nickname }));
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('userDisconected', socket.id);
  });
});
