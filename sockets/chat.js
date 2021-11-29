const Message = require('../models/Messages');

const onlineUsers = [];

const disconnect = (socket, io) => {
  socket.on('disconnect', () => {
    console.log('Disconnected user');
    const userIndex = onlineUsers.findIndex((item) => item.id === socket.id);
    onlineUsers.splice(userIndex, 1);
    io.emit('online', onlineUsers);
  });
};

const message = (socket, io) => {
  socket.on('message', async (msg) => {
    const date = new Date();
    const [year, day, month] = [date.getFullYear(), date.getDate(), date.getMonth()];
    const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    // DD-MM-yyyy HH:mm:ss
    const messageTime = `${day}-${month + 1}-${year} ${hour}:${minute}:${second}`;
    const formattedMessage = `${messageTime} - ${msg.nickname}: ${msg.chatMessage}`;
    io.emit('message', formattedMessage);
    await Message.saveMessages({
      nickname: msg.nickname,
      message: msg.chatMessage,
      timestamp: messageTime,
    });
    console.log(formattedMessage);
  });
};

const newUser = (socket, io) => {
  socket.on('newUser', (nickname) => {
    onlineUsers.push({ id: socket.id, nickname });
    io.emit('online', onlineUsers);
  });
};

const editUser = (socket, io) => {
  socket.on('editUser', (nickname) => {
    const index = onlineUsers.findIndex((item) => item.id === socket.id);
    onlineUsers[index].nickname = nickname;
    io.emit('online', onlineUsers);
  });
};

const chat = (io) => {
  io.on('connection', (socket) => {
    console.log('Connected user');
    newUser(socket, io);
    editUser(socket, io);
    disconnect(socket, io);
    message(socket, io);
  });
};

module.exports = chat;