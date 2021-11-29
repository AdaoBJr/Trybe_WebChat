const date = require('../helpers/formatDate');
const Model = require('../models/messageModel');
const { addUser, updateNickname, disconnect } = require('../helpers/updateUsers');

const newDate = date();

const allMessages = (socket, messagesDb) => {
   const messages = messagesDb
    .map((message) => `${newDate} - ${message.nickname}: ${message.message}`);
  socket.emit('messageList', messages);
  return messages;
};

module.exports = (io) => io.on('connection', async (socket) => {
  socket.on('newUser', (nickname) => {
    const onlineUsers = addUser({ socketId: socket.id, nickname });
    io.emit('onlineUsers', onlineUsers);
  });
  
  socket.on('updateNickname', (newNickname) => { 
    updateNickname(socket.id, newNickname, io); 
  });
  
  const messages = await Model.getAll();
  allMessages(socket, messages);
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    await Model.createMessage(chatMessage, nickname, newDate);
    io.emit('message', `${newDate} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => { 
    disconnect(io, socket); 
  });
});
