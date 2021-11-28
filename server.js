const express = require('express');
const cors = require('cors');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);

app.use(cors());
app.use(express.json());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { addNewMessage, getAllMessages } = require('./models/message');

let users = [];

const addMessage = (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    const now = moment().format('DD-MM-yyyy h:mm:ss A');
    const message = `${now} - ${nickname}: ${chatMessage}`;
    await addNewMessage(chatMessage, nickname, now);
    io.emit('message', message);
  });
};

const changeNickname = (socket) => {
  socket.on('changeNickname', ({ oldNickname, newNickname }) => {
    const excludeOldNickname = users.filter(({ nickname }) => nickname !== oldNickname);
    users = excludeOldNickname;
    users.push({ nickname: newNickname, id: socket.id });
    const usersNicknames = users.map((user) => user.nickname);
    io.emit('users', usersNicknames);
  });
};

io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();
  socket.emit('messages', allMessages);

  addMessage(socket);

  socket.on('nickname', (nickname) => {
    users.push({ nickname, id: socket.id });
    const usersNicknames = users.map((user) => user.nickname);
    io.emit('users', usersNicknames);
  });

  changeNickname(socket);

  socket.on('disconnect', () => {
    const onlineUsers = users.filter(({ id }) => id !== socket.id);
    users = onlineUsers;
    const usersNicknames = users.map((user) => user.nickname);
    io.emit('users', usersNicknames);
  });
});

const PORT = '3000';

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/view/index.html`);
});

http.listen(PORT, () => {
  console.log('Online');
});
