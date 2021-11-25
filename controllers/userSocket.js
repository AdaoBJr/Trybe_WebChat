/* eslint-disable max-lines-per-function */
const { addMessageToChat, getAllMessages } = require('../models/messages');

const usersInChat = {};

module.exports = (io) => {
  io.on('connection', async (socket) => {
      const chatMessages = await getAllMessages();

      socket.emit('connected', chatMessages);

      socket.on('message', async ({ chatMessage, nickname }) => {
        // console.log(usersInChat[socket.id]);
        const userName = nickname || usersInChat[socket.id];
        io.emit('message', await addMessageToChat({ chatMessage, nickname: userName }));
      });
      socket.on('setUserName', async (userName) => {
        console.log('user do front para o back', userName);
        const nick = userName || socket.id.slice(0, 16);
        usersInChat[socket.id] = nick;
        // console.log('usuarios logados:\n\n', usersInChat);

        socket.emit('thisIsYourData', { socketId: socket.id, nickname: nick });
        io.emit('updateUserList', usersInChat);
      });

      socket.on('disconnect', async () => {
      delete usersInChat[socket.id];
      // console.log('Um saiu, usuarios que continuam logados:\n\n', usersInChat);
      socket.broadcast.emit('updateUserList', usersInChat);
      });
  });
};
