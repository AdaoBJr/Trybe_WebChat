const moment = require('moment');
const model = require('../models/chat');

const newMessage = (io, socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const time = moment().format('DD-MM-yyyy h:mm:ss A');
    const formatMessage = `${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', formatMessage);
    await model.newMessage(chatMessage, nickname, time);
  });
};

let users = [];

const checkNickname = (nickname, socket) => {
  if (!users.includes(nickname)) {
    users.push({ name: nickname, id: socket.id });
  }
  return nickname;
};

const newUser = (io, socket) => {
  socket.on('newNickname', (nickname) => {
    users = users.map((user) => {
      if (user.id === socket.id) {
        return { ...user, name: nickname };
      } return user;
    });
    // console.log(users);
    io.emit('userList', users);
  });
};

const startNickname = (io, socket) => {
  socket.on('nickname', (nickname) => {
    checkNickname(nickname, socket);
    io.emit('userList', users);
  });
};

const getMessages = async (socket) => {
  const messages = await model.getMessages();
  socket.emit('messageList', messages);
};

const removeUser = (socket) => {
  users = users.filter((user) => user.id !== socket.id);
};

module.exports = (io) => io.on('connection', (socket) => {
  newMessage(io, socket);
  newUser(io, socket);
  startNickname(io, socket);
  getMessages(socket);
  socket.on('disconnect', () => {
    removeUser(socket);
    io.emit('userList', users);
  });
});
