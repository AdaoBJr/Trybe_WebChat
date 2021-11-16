module.exports = (io) => io.on('connection', (socket) => {
  const getDate = () => {
    const horas = new Date();
    const dataFormatada = horas.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const horaFormatada = `${horas.getHours()}:${horas.getMinutes()}:${horas.getSeconds()}`;
    return (`${dataFormatada} ${horaFormatada}`);
  };
  socket.on('joinRoom', (nickname) => {
  socket.emit('message', 'Olá, seja bem vindo ao nosso chat público.');

  socket.broadcast.emit('message', `Iiiiiirraaaa! ${nickname} acabou de se conectar :D`);

  socket.on('message', ({ chatMessage }) => {
    io.emit('message', `${getDate()} - ${nickname}: ${chatMessage}`);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', `Xiii! ${nickname} acabou de se desconectar! :(`);
  });
});
});
