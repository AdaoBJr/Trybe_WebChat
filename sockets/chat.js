const model = require('../models/messages');

const users = {};

const getDate = () => {
  const horas = new Date();
  const dataFormatada = horas.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  const horaFormatada = `${horas.getHours()}:${horas.getMinutes()}:${horas.getSeconds()}`;
  return (`${dataFormatada} ${horaFormatada}`);
};

const saveMessage = async (message, nickname) => {
  const timestamp = getDate();
  await model.create({ message, nickname, timestamp });
  return `${timestamp} ${nickname} ${message}`;
};

module.exports = (io) => io.on('connection', async (socket) => {
  const historic = await model.getAll().then((e) => e.map(({ timestamp, nickname, message }) =>
  `${timestamp} ${nickname} ${message}`));

  users[socket.id] = socket.id.slice(0, 16);

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
    console.log(users);
    io.emit('users', Object.values(users));
  });
});