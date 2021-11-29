let onlineUsers = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('userOnline', (nickname) => {
      onlineUsers.push([nickname, socket.id]);
  
      io.emit('userOnline', onlineUsers);
    });

    socket.on('disconnect', () => {
      onlineUsers = onlineUsers.filter(([, id]) => id !== socket.id);
  
      io.emit('userOnline', onlineUsers);
    });

    socket.on('updateNickname', (nickname) => {
      onlineUsers = onlineUsers.map((el) => {
        if (el[1] === socket.id) return [nickname, socket.id];
        return el;
      });
      io.emit('userOnline', onlineUsers);
    });
  });
};
