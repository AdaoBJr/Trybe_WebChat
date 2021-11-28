const date = require('../helpers/formatDate');

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', `${date()} - ${nickname}: ${chatMessage}`);

    socket.on('disconnect', () => {
      socket.broadcast.emit('serverMessage', `${socket.id} acabou de se desconectar! :(`);
    });
  });
}); 