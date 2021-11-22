const express = require('express');
const cors = require('cors');

const PORT = 3000;

const app = express();
const http = require('http').createServer(app);

const formattedDate = () => {
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const fullHour = `${date.getHours()}:${date.getMinutes()}`;
  const pmOrAm = fullHour < 12 ? 'AM' : 'PM';
  return `${currentDate} ${fullHour} ${pmOrAm}`;
};

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

let message = [];
io.on('connection', (socket) => {
  const newNickname = randomString(16);
  socket.emit('login', newNickname);
  socket.broadcast.emit('newLogin', { usuario: newNickname });

  socket.on('message', (data) => {
    message = `${formattedDate()} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', message);
    socket.broadcast.emit('receivedMessage', message);
  });
});

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', (_req, res) => {
  res.render('index', { message });
});

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
