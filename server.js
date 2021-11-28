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

io.on('connection', async (socket) => {
  const allMessages = await getAllMessages();
  socket.emit('messages', allMessages);

  socket.on('message', async ({ chatMessage, nickname }) => {
    const now = moment().format('DD-MM-yyyy h:mm:ss A');
    const message = `${now} - ${nickname}: ${chatMessage}`;
    await addNewMessage(chatMessage, nickname, now);
    io.emit('message', message);
  });

  socket.on('nickname', (nickname) => {
    users.push(nickname);
    io.emit('users', users);
  });

  socket.on('changeNickname', ({ oldNickname, newNickname }) => {
    const excludeOldNickname = users.filter((user) => user !== oldNickname);
    users = excludeOldNickname;
    users.push(newNickname);
    io.emit('users', users);
  });
});

const PORT = '3000';

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/view/index.html`);
});

http.listen(PORT, () => {
  console.log('Online');
});
