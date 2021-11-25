const { addMessageToChat, getAllMessages } = require('../models/messages');

const usersInChat = {};

module.exports = (io) => {
  io.on('connection', async (socket) => {
      const chatMessages = await getAllMessages();

      socket.emit('connected', chatMessages);

      socket.on('message', async ({ chatMessage }) => {
        const nickname = usersInChat[socket.id];
        io.emit('message', await addMessageToChat({ chatMessage, nickname }));
      });
      socket.on('setUserName', async (userName) => {
        const nick = userName || socket.id.slice(0, 16);
        usersInChat[socket.id] = nick;

        socket.emit('thisIsYourData', { socketId: socket.id, nickname: nick });
        io.emit('updateUserList', usersInChat);
      });

      socket.on('disconnect', async () => {
      delete usersInChat[socket.id];

      socket.broadcast.emit('updateUserList', usersInChat);
      });
  });
};
