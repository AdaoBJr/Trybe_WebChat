const crypto = require('crypto');
const model = require('../models/data');

const generateUserName = () => crypto.randomBytes(8).toString('hex');
const users = {};

module.exports = (io) => io.on('connection', async (socket) => {
  const getMessages = await model.getAllMessages()
  .then((e) => e
  .map(({ timestamp, nickname, message }) => `${timestamp} - ${nickname}: ${message}`));

  socket.emit('histories', getMessages);
  
  users[socket.id] = generateUserName();
  socket.emit('joined', users);
  
  socket.on('updateNick', ({ nickname, socketId }) => {
    users[socketId] = nickname;
  });
  
  socket.broadcast.emit('joined', { newUser: users[socket.id] });

  socket.on('message', async ({ chatMessage, nickname }) => {
    io.emit('message', await model.createMessage({ chatMessage, nickname }));
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});
