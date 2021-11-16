const { saveMessageModel, getAllMessages } = require('./controllers/chatController');

const usersLogged = [];

const saveMessage = async (chatMessage, nickname, io, idAleatorio) => {
  let name;
  if (!nickname) {
    name = idAleatorio;
  } else {
    name = nickname;
  }
  const date = new Date();
  const data = date.toISOString().substr(0, 10).split('-').reverse()
  .join('-');
  const horas = date.toLocaleTimeString();
  const timestamp = `${data} ${horas}`;
  await saveMessageModel({ chatMessage, nickname, timestamp });
  io.emit('message', `${timestamp} - ${name} : ${chatMessage}`);
};

const getAll = async () => {
  const result = await getAllMessages();
  return result;
};

const disconnect = (id) => {
  const result = usersLogged.map((curr, index) => {
    if (curr === id) {
      usersLogged.splice(index, 1);
    }
    return curr;
  });
  return result;
};

const attName = (nickname, idAleatorio) => {
  usersLogged.map((curr, index) => {
    if (curr === idAleatorio) {
      usersLogged.splice(index, 1);
      usersLogged.push(nickname);
    }
    return curr;
  });
  return nickname;
};

module.exports = (io) => 
io.on('connection', async (socket) => {
    let idAleatorio = socket.id.slice(0, 16);
    usersLogged.unshift(idAleatorio);
    io.emit('online', usersLogged);
    
    socket.on('saveUser', (nickname) => {
      idAleatorio = attName(nickname, idAleatorio);
      io.emit('online', usersLogged);
    });
    
    socket.on('message', ({ chatMessage, nickname }) => {
      saveMessage(chatMessage, nickname, io, idAleatorio);
    });
    const getAlls = await getAll();

    io.emit('html', getAlls);
    
    socket.on('disconnect', () => {
      disconnect(idAleatorio);
      io.emit('online', usersLogged);
    });
});