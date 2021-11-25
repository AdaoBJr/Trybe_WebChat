const MessageModel = require('../models/Message');

const getDateTimeNow = () => {
  const dateActual = new Date().toLocaleString();
  return dateActual.replace(/\//g, '-');
};

const formatedMessage = ({ message, nickname, timestamp }) =>
  `${timestamp} - ${nickname}: ${message}`;

const allPreviousMessages = async () => {
  const messages = await MessageModel.getAll();
  const formated = messages.map((message) => formatedMessage(message));
  return formated;
};

let allUsers = [];

const addUpdateUser = (socketId, nickname) => {
  const array = allUsers.find((user) => user.id === socketId);

  if (!array) {
    allUsers.push({ id: socketId, nickname });
  } else {
    const newArray = allUsers.map((user) => {
      if (user.id === socketId) {
        return {
          id: user.id,
          nickname,
        };
      }
      return user;
    });
    allUsers = newArray;
  }
};

const allMessagesDB = async (socket) => {
  const allMessages = await allPreviousMessages();

  socket.emit('allMessages', allMessages);
};

const addMessageDB = (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const objMessage = {
      message: chatMessage,
      nickname,
      timestamp: getDateTimeNow(),
    };

    await MessageModel.addMessage(objMessage);

    const messageString = formatedMessage(objMessage);

    socket.emit('message', messageString);
    socket.broadcast.emit('message', messageString);
  });
};

const userDisconnect = (socket, socketId) => {
  socket.on('disconnect', () => {
    allUsers = allUsers.filter((user) => user.id !== socketId);

    socket.emit('users', allUsers);
    socket.broadcast.emit('users', allUsers);
  });
};

module.exports = (io) =>
  io.on('connection', (socket) => {
    console.log(`Usuário conectado. ID: ${socket.id} `);

    let socketId = '';
    allMessagesDB(socket);
    addMessageDB(socket);
    socket.on('users', (nickname) => {
      socketId = socket.id;

      addUpdateUser(socketId, nickname);

      const changeFirst = allUsers.filter((user) => user.id !== socketId);
      changeFirst.unshift({ id: socketId, nickname });

      socket.emit('users', changeFirst);
      socket.broadcast.emit('users', allUsers);

      userDisconnect(socket, socketId);
    });
  });
