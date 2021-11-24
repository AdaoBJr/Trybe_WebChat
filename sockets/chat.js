const model = require('../models/message');

// const users = [];

// https://github.com/tryber/sd-010-b-project-talker-manager/pull/34/files
function generateNickname(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newNickname = '';
  for (let i = 0; i < n; i += 1) {
    newNickname += chars[Math.floor(Math.random() * chars.length)];
  }
  return newNickname;
}

module.exports = (io) => io.on('connection', async (socket) => {
  io.emit('nickname', generateNickname(16));
  
  socket.on('users', (user) => {
    io.emit('users', user);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const response = await model.createMessage({ chatMessage, nickname });
    io.emit('message', response);    
  });
});
