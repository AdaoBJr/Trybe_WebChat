const moment = require('moment');
const { addMessageToChat } = require('../models/messages');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // console.log(`Connected user: ${socket.id}`);
    socket.on('message', async ({ chatMessage, nickname }) => {
      const date = moment().format('DD-MM-YYYY HH:mm:ss a');
      const message = `${date} - ${nickname}: ${chatMessage}`;
      await addMessageToChat(message);
      io.emit('message', message);
    });
  });
};
