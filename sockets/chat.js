const messageModel = require('../models/message');

let allUsers = [];

const getActualDate = () => new Date().toLocaleString().replace(/\//g, '-');

const displayedMessage = ({ nickname, timestamp, message }) =>
  `${timestamp} - ${nickname}: ${message}`;

const getAllMessages = async () => {
  const messagesList = await messageModel.getAllMessages();

  const formatedMessages = messagesList.map((message) => displayedMessage(message));

  return formatedMessages;  
};

const addUpdateUser = (socketId, nickname) => {
  const usersBySocketId = allUsers.find((user) => user.id === socketId);

  if (!usersBySocketId) {
    allUsers.push({ id: socketId, nickname });
  } else {
    const allUsersMapped = allUsers.map((user) => {
      if (user.id === socketId) {
        return {

          id: user.id,

          nickname,

        };
      }
      return user;
    });

    allUsers = allUsersMapped;
  }
};

const emitAllMessages = async (socket) => {
  const messagesList = await getAllMessages();

  socket.emit('allMessages', messagesList);
};

const saveMessage = (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const messageProps = {

      message: chatMessage,

      nickname,

      timestamp: getActualDate(),

    };

    await messageModel.saveMessage(messageProps);

    const message = displayedMessage(messageProps);

    socket.emit('message', message);

    socket.broadcast.emit('message', message);
  });
};

const disconnectUser = (socket, socketId) => {
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

    emitAllMessages(socket);

    saveMessage(socket);

    socket.on('users', (nickname) => {
      socketId = socket.id;

      addUpdateUser(socketId, nickname);

      const changeFirst = allUsers.filter((user) => user.id !== socketId);

      changeFirst.unshift({ id: socketId, nickname });

      socket.emit('users', changeFirst);

      socket.broadcast.emit('users', allUsers);

      disconnectUser(socket, socketId);
    });
  });