const model = require('../models/message');

// https://github.com/tryber/sd-010-b-project-talker-manager/pull/34/files
function generateNickname(n) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newNickname = '';
  for (let i = 0; i < n; i += 1) {
    newNickname += chars[Math.floor(Math.random() * chars.length)];
  }
  return newNickname;
}

const userList = [];

module.exports = (io) => io.on('connection', async (socket) => {
  const historic = await model.getAllMessage()
    .then((e) => e.map(({ timestamp, nickname, message }) =>
    `${timestamp} - ${nickname}: ${message}`));

  socket.emit('newConnection', historic);

  socket.emit('userOnline', userList);

  const usuario = { nickname: generateNickname(16), userID: socket.id };
  userList.push(usuario);

  io.emit('users', usuario);
  
  socket.on('users', (user) => {
    io.emit('nickname', user);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const response = await model.createMessage({ chatMessage, nickname });
    io.emit('message', response);    
  });

  // socket.on('disconnect', () => io.emit('disconnect', socket.id));
});
