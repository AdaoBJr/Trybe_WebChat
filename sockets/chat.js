const model = require('../models/message');

// const users = [];

module.exports = (io) => io.on('connection', async (socket) => {
  console.log('estou aqui conectado');
  socket.on('users', (user) => {
    // console.log(user);
    io.emit('users', user);
  });

  socket.on('message', async ({ chatMessage, nickname }) => {
    // console.log(chatMessage);
    const response = await model.createMessage({ chatMessage, nickname });
    // console.log('erro', chatMessage);
    console.log('estou no Socket', response);
    io.emit('message', response);    
  });
});
