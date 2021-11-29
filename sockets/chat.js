const date = require('../helpers/formatDate');
const Model = require('../models/messageModel');

// const userArray = [];
const newDate = date();

module.exports = (io) => io.on('connection', async (socket) => {
  const getAllmessages = await Model.getAll();
  const messages = getAllmessages
    .map((value) => `${newDate} - ${value.nickName}: ${value.message}`);
  socket.emit('listMessages', messages);

  socket.on('message', async ({ chatMessage, nickname }) => {
    await Model.createMessage(chatMessage, nickname, newDate);
    io.emit('message', `${newDate} - ${nickname}: ${chatMessage}`);
  });
}); 
