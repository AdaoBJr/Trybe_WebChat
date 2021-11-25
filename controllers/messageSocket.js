const { addMessageToChat } = require('../models/messages');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Connected user: ${socket.id}`);

    socket.on('message', async ({ chatMessage, nickname }) => {
      const message = await addMessageToChat({ chatMessage, nickname });
      socket.emit('message', message);
    });
  });
};
