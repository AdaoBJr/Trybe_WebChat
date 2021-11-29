const messageController = require('../controllers/messages');

let nicknames = [];

const updateNicksOnLogin = (nickname, io, socket) => {
  nicknames.push({ id: socket.id, nickname });
  const onlyNicknames = nicknames.map(({ nickname: elNickname }) => elNickname);
  io.emit('updateNicknames', onlyNicknames);
};

const sendMessage = async (chatMessage, nickname, io) => {
  const now = messageController.newDate();
  await messageController.sendMessage(chatMessage, nickname, now);
  io.emit('message', `${now} - ${nickname}: ${chatMessage}`);
};

const changeNicknames = (oldNickname, newNickname, io, socket) => {
  nicknames = nicknames.map(({ nickname, id }) => {
    if (oldNickname === nickname && id === socket.id) {
      return { nickname: newNickname, id };
    } 
      return { nickname, id };
  });
  const onlyNicknames = nicknames.map(({ nickname: elNickname }) => elNickname);
  io.emit('updateNicknames', onlyNicknames);
};

const handleDisconnect = (io, socket) => {
  nicknames = nicknames.filter(({ id }) => id !== socket.id);
  const onlyNicknames = nicknames.map(({ nickname: elNickname }) => elNickname);
  io.emit('updateNicknames', onlyNicknames);
};

module.exports = (io) => io.on('connection', (socket) => {
  socket.on('logged', (nickname) => updateNicksOnLogin(nickname, io, socket));

  socket.on('message', async ({
    chatMessage,
    nickname,
  }) => sendMessage(chatMessage, nickname, io));

  socket.on('changeNicknames', ({
    oldNickname,
    newNickname,
  }) => changeNicknames(oldNickname, newNickname, io, socket));

  socket.on('disconnect', () => handleDisconnect(io, socket));
});
