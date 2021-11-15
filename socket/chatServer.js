const crypto = require('crypto');
const chatModel = require('../models/chatModel');

const actualDate = new Date().toLocaleString().replace(/\//g, '-');

const users = [];
let actualUser;

const setUserName = (io, socket, nickname) => {
  if (!users.includes(nickname)) {
    users.push({ nickname, id: socket.id });
  }
  io.emit('connected', { users, actualUser: nickname });
};

const modifyName = (io, socket, userObject) => {
  const actualUserIn = users.findIndex((user) => user.id === socket.id);
  if (actualUserIn >= 0) {
    users[actualUserIn].nickname = userObject.nickname;
    io.emit('listAllUsers', users);
  }
};

const setMessage = async (io, socket) => {
  const { chatMessage, nickname } = socket;
  let userName = nickname;
  if (nickname === '') userName = actualUser;
  const message = await chatModel.createMessage(chatMessage, userName, actualDate);
  io.emit('message', JSON.stringify(message));
};

const userDisconnect = async (io, socket) => {
  const userIndex = users.findIndex((user) => user.id === socket.id);
  users.splice(userIndex, 1);
  console.log('User disconnected');
  io.emit('listAllUsers', users);
};

module.exports = (io) => {
  io.on('connection', async (socket) => {
    actualUser = crypto.randomBytes(8).toString('hex');
    setUserName(io, socket, actualUser);

    const allMessages = await chatModel.getAllMessages();
    console.log('User connected');
    console.log(users);

    socket.emit('listAllMessages', allMessages);
    socket.emit('listAllUsers', users);
    socket.on('disconnect', () => userDisconnect(io, socket));
    socket.on('message', (objectMessage) => setMessage(io, objectMessage));
    socket.on('modifyName', (userObject) => modifyName(io, socket, userObject));
  });
};