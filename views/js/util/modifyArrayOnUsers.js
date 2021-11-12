module.exports = (onUsers, newNickName, oldNickName, socket) => {
  // look in the array for the old nickname and add the new one
  onUsers[onUsers.findIndex((obj) => obj.data === oldNickName)] = { data: newNickName, id: socket };
};