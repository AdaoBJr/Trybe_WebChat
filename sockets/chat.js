const moment = require('moment');

const newMessage = (io, socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const time = moment().format('DD-MM-yyyy h:mm:ss A');
    const formatMessage = `${time} - ${nickname}: ${chatMessage}`;
    io.emit('message', formatMessage);
  });
};

const users = [];

const newUser = (io, socket) => {
  socket.on('newNickname', (nickname) => {
    // console.log(nickname);
    users.push(nickname);
    io.emit('userList', users);
  });
};

const startNickname = (io, socket) => {
  socket.on('nickname', (nickname) => {
    console.log(nickname);
    users.push(nickname);
    io.emit('userList', users);
  });
};

module.exports = (io) => io.on('connection', (socket) => {
  newMessage(io, socket);
  // io.emit('newUser', socket.id.substr(0, 16));
  newUser(io, socket);
  startNickname(io, socket);
});
