const { addMessageToChat, getAllMessages } = require('../models/messages');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log(`Connected user: ${socket.id}`);

    const chatMessages = await getAllMessages();
    socket.emit('connected', chatMessages);

    socket.on('message', async ({ chatMessage, nickname }) => {
      const newMessage = await addMessageToChat({ chatMessage, nickname });

      io.emit('message', newMessage);
    });
  });
};
