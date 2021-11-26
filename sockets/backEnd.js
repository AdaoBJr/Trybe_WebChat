const crypto = require('crypto');
const model = require('../models/data');

const generateUserName = () => crypto.randomBytes(8).toString('hex');
const users = {};

module.exports = (io) => io.on('connection', async (socket) => {
  users[socket.id] = generateUserName();
  console.log('usersObj', users);
  socket.emit('joined', users);
  
  // socket.on('updateNick', async () => {
  //       io.emit('updateNick', await model.updateUser(socket.id));
  //   });
    
  socket.on('message', async ({ chatMessage }) => {
    const nickname = users[socket.id];
    io.emit('message', await model.createMessage({ chatMessage, nickname }));
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});
