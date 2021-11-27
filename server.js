const express = require('express');
const cors = require('cors');

const PORT = 3000;

const app = express();
const http = require('http').createServer(app);

app.use(cors());
const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const { formattedDateAndHour } = require('./helpers/dateAndHour');
const chatController = require('./controller/chatController');
const randomString = require('./helpers/randomNickname');

let message = [];
const users = [];
let nickName = '';

const addUsers = (nickname, socket) => {
  const getId = users.findIndex((user) => user.id === socket.id);
  users[getId].nickname = nickname;
  return users;
};

const onlineUsers = (IO, socket, nickname) => {
  console.log(users);
  users.push({ id: socket.id, nickname });
  io.emit('usersOnline', users);

  // if (users.length > 0) {
  //   users.forEach((user) => {
  //     socket.emit('usersOnline', user);
  //   });
  // }

  console.log('populou', users);
};

io.on('connection', (socket) => {
  // if (users.length === 0) socket.disconnect(0);
  nickName = randomString(16);
  onlineUsers(io, socket, nickName);
  socket.on('updateNickname', (nickname) => {
    addUsers(nickname, socket);
    io.emit('updateNickname', { nickname, id: socket.id });
  });
  
  socket.on('disconnect', () => {
    const getId = users.findIndex((user) => user.id === socket.id);
    users.splice(getId, 1);
    // socket.disconnect(0);
    io.emit('usersOnline', users);
  });

  socket.on('message', async (data) => {
    await chatController.saveMessages(data);
    message = `${formattedDateAndHour()} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', message);
  });
});

const getMessages = () => chatController.getAllMessages();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async (_req, res) => {
  res.render('index', { messages: await getMessages() });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});