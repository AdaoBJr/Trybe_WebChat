const { addMessageToChat, getAllMessages } = require('../models/messages');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const chatMessages = await getAllMessages();

    socket.emit('connected', chatMessages);

    socket.on('message', async ({ chatMessage, nickname }) => {
      io.emit('message', await addMessageToChat({ chatMessage, nickname }));
    });
  });
};
