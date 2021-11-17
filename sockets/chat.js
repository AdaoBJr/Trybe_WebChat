const moment = require('moment');
const model = require('../models/messages');

const users = {};

const saveMessage = async (message, nickname) => {
  const timestamp = moment().format('DD-MM-yyyy LTS');
  await model.create({ message, nickname, timestamp });
  return `${timestamp} ${nickname} ${message}`;
};

module.exports = (io) => io.on('connection', async (socket) => {
  const historic = await model.getAll().then((e) => e.map(({ timestamp, nickname, message }) =>
  `${timestamp} ${nickname} ${message}`));

  users[socket.id] = socket.id.slice(0, 10);

  socket.emit('newConnection', { user: users[socket.id], historic });

  socket.on('nickname', (nickname) => {
    users[socket.id] = nickname;
    io.emit('users', Object.values(users));
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    const response = await saveMessage(chatMessage, nickname);
    io.emit('message', response);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users', Object.values(users));
  });
});