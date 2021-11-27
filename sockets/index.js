const moment = require('moment');
const messagesModel = require('../models/messages');

const date = new Date();
const format = 'DD-MM-YYYY hh:mm A';
const format1 = 'YYYY-MM-DD HH:mm:ss';
const usersOnline = [];

const messageUsers = (socket, io) => {
  socket.on('message', async ({ nickname, chatMessage }) => {
    const dateTime = moment(date).format(format);
    const dateForDB = moment(date).format(format1);
    const messageToSend = `${dateTime} - ${nickname}: ${chatMessage}`;
    await messagesModel.insertMessages(nickname, chatMessage, dateForDB);
    io.emit('message', messageToSend);
  });
};

const changeNickname = (socket, io) => {
  socket.on('changeNickname', (nickname) => {
    const objIndex = usersOnline.findIndex(((user) => user.id === socket.id));
    usersOnline[objIndex].nickname = nickname;
    io.emit('usersList', usersOnline);
  });
};

const newUserOnline = (socket, io) => {
  socket.on('newUserOnline', (user) => {
    usersOnline.push({ id: socket.id, nickname: user });
    io.emit('usersList', usersOnline);
  });
};

const oldMessages = async (socket) => {
  const messages = await messagesModel.getAllMessages();
  if (messages) {
    const list = messages.map((message) => {
      const messageToSend = `${message.timeStamp} - ${message.name}: ${message.message}`;
      return messageToSend;
    });
    socket.emit('oldMessages', list);
  }
};

const disconnectedUser = (socket, io) => {
  socket.on('disconnect', () => {
    const objIndex = usersOnline.findIndex(((user) => user.id === socket.id));
    usersOnline.splice(objIndex, 1);
    io.emit('disconnectUser', usersOnline);
  });
};

const webChatSocket = (io) => {
  io.on('connection', (socket) => {
    oldMessages(socket);

    messageUsers(socket, io);

    newUserOnline(socket, io);

    changeNickname(socket, io);

    disconnectedUser(socket, io);
  });
};

module.exports = { webChatSocket };