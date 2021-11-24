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

const users = [];

const checkNickname = (nickname) => {
  if (!users.includes(nickname)) {
    users.push(nickname);
  }
  return nickname;
};

const newUser = (io, socket) => {
  socket.on('newNickname', (nickname) => {
    checkNickname(nickname);
    io.emit('userList', users);
  });
};

const startNickname = (io, socket) => {
  socket.on('nickname', (nickname) => {
    // socket.nickname = nickname;
    checkNickname(nickname);
    io.emit('userList', users);
  });
};

const getMessages = async (socket) => {
  const messages = await model.getMessages();
  socket.emit('messageList', messages);
};

// const disconnectUser = (io, socket) => {
//   socket.on('removeUser', () => {
//     users = users.filter((user) => user !== socket.nickname);
//     io.emit('userList', users);
//   });
// };

module.exports = (io) => io.on('connection', (socket) => {
  newMessage(io, socket);
  newUser(io, socket);
  startNickname(io, socket);
  getMessages(socket);
  // socket.on('disconnect', () => {
  //   checkNickname(nickname);
  // });
  // disconnectUser(io, socket);
});
