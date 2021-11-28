const messageController = require('../controllers/messages');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const now = messageController.newDate();
    await messageController.sendMessage(chatMessage, nickname, now);
    io.emit('message', `${now} - ${nickname}: ${chatMessage}`);
  });
});
