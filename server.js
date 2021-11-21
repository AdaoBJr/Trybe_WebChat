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

app.use(cors());
const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const onlineUsers = [];
let message = [];
io.on('connection', (socket) => {
  console.log(`Usuário conectado. ID: ${socket.id}`);
  console.log(onlineUsers);

  socket.on('message', (data) => {
    message = `${formattedDate()} - ${data.nickname}: ${data.chatMessage}`;
    io.emit('message', message);
    socket.broadcast.emit('receivedMessage', message);
  });

  socket.on('newNickname', (nickname) => {
    onlineUsers.push(nickname);
    io.emit('onlineUsers', onlineUsers);
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
