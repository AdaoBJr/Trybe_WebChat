module.exports = (io) => io.on('connection', async (socket) => {
  console.log(`${socket.id} conectado`);

  socket.on('message', ({ nickname, chatMessage }) => {
    const timestamp = new Date().toLocaleString().replace(/\//g, '-');
    const formatedMessage = `${timestamp} ${nickname}: ${chatMessage}`;
    io.emit('message', formatedMessage);
  });

  socket.on('disconnect', () => {
    console.log('alguém saiu');
  });
}); 