const express = require('express');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const date = new Date();
const format = 'DD-MM-YYYY hh:mm A';
const usersOnline = [];

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('message', ({ nickname, chatMessage }) => {
    const dateTime = moment(date).format(format);
    const messageToSend = `${dateTime} - ${nickname}: ${chatMessage}`;
    io.emit('message', messageToSend);
  });
  socket.on('newUserOnline', (user) => {
    usersOnline.push({ id: socket.id, nickname: user });
    io.emit('usersList', usersOnline);
  });

  socket.on('changeNickname', (nickname) => {
    const objIndex = usersOnline.findIndex(((user) => user.id === socket.id));
    usersOnline[objIndex].nickname = nickname;
    io.emit('usersList', usersOnline);
  });
});

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const PORT = 3000;  

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});