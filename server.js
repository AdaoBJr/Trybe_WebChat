const express = require('express');
const cors = require('cors');

const PORT = 3000;

const app = express();
const http = require('http').createServer(app);

// https://www.youtube.com/watch?v=Hr5pAAIXjkA&ab_channel=DevPleno
const randomString = (length) => {
  let nickname = '';
  do {
    nickname += Math.random().toString(36).substr(2);
  } while (nickname.length < length);
  nickname = nickname.substr(0, length);
  return nickname;
};

app.use(cors());
const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const { formattedDateAndHour } = require('./helpers/dateAndHour');
const chatController = require('./controller/chatController');

let message = [];
io.on('connection', (socket) => {
  let newNickname = randomString(16);
  socket.emit('login', newNickname);
  socket.broadcast.emit('newLogin', { usuario: newNickname });
  
  socket.on('nick', (nick) => {
    newNickname = nick;
    io.emit('newNick', nick);
  });
  
  socket.on('message', async (data) => {
    await chatController.saveMessages(data);
    message = `${formattedDateAndHour()} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', message);
  });
});

const getMessages = async () => {
  const allMessages = await chatController.getAllMessages();
  console.log('server all messages', allMessages);
  return allMessages;
};

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', async (_req, res) => {
  res.render('index', { messages: await getMessages() });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
