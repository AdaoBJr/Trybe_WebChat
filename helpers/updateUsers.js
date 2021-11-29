const userArray = [];

const allUsers = () => userArray;

const addUser = (user) => {
  userArray.push(user);

  return userArray;
};

const removeUsers = (socketId) => {
  const userInfo = userArray.find((user) => user.socketId === socketId);
  const userInfoIndex = userArray.indexOf(userInfo);
  if (userInfoIndex > -1) {
    userArray.splice(userInfoIndex, 1);
  }
};

const updateNickname = (socketId, newNickname, io) => {
  const userInfo = userArray.find((user) => user.socketId === socketId);
  const userIndex = userArray.indexOf(userInfo);
  userArray[userIndex] = {
    socketId,
    nickname: newNickname,
  };
  io.emit('onlineUsers', userArray);
};

const disconnect = (io, socket) => {
  removeUsers(socket.id);
  io.emit('onlineUsers', userArray);
  socket.disconnect();
};

module.exports = {
  removeUsers,
  updateNickname,
  disconnect,
  allUsers,
  addUser,
};