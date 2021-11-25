const usersInChat = {};

module.exports = (io) => {
    io.on('connection', async (socket) => {
      socket.on('setUserName', async (userName) => {
        const nick = userName || socket.id.slice(0, 16);
        usersInChat[socket.id] = nick;

        socket.emit('thisIsYourData', { socketId: socket.id, nickname: nick });
        io.emit('updateUserList', usersInChat);
      });

    socket.on('disconnect', async () => {
      delete usersInChat[socket.id];

      socket.broadcast.emit('updateUserList', usersInChat);
    });
    });
};
