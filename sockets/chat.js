module.exports = (io) => io.on('connection', (socket) => {
  // socket.emit: Emite a msg SOMENTE para o socket que se conectou
  socket.emit('message', 'Olá, seja bem vindo ao nosso chat');

  // socket.broadcast.emit: Emite a msg pata TODOS, MENOS para o socket que se conectou
  socket.broadcast.emit('message', `${socket.id} acabou de se conectar`);

  socket.on('message', (message) => {
    console.log(`Mensagem ${message}`);

    // oi.emit: Emite a msg pata TODOS os sockets conectados
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `${socket.id} se desconectou!`);
  });
});