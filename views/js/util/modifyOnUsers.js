module.exports = (onUsers, newNickName, oldNickName, socket) => {
  // look in the array for the old nickname and add the new one
  const arr = onUsers;
  arr[arr.findIndex((obj) => obj.data === oldNickName)] = { data: newNickName, id: socket };
};