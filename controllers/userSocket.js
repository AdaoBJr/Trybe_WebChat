const { createUser } = require('../models/userModel');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Connected user: ${socket.id}`);

    socket.on('createUser', async ({ name }) => {
      const user = await createUser({ name });
      socket.emit('newUser', user);
    });
  });
};
