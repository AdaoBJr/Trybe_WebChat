const cors = require('cors');
const express = require('express');
const path = require('path');

const messages = [];
const users = [];
const socketsUsers = {};

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(cors());

// https://stackoverflow.com/questions/60240603/nodejs-mime-type-text-html-is-not-a-supported-stylesheet-mime-type
app.use('/css', express.static(`${__dirname}/views/css`));

const { getDateTime } = require('./utils/dateTime');

const removeUser = (socket) => {
  const nickname = socketsUsers[socket.id];
  const index = users.indexOf(nickname);
  
  users.splice(index, 1);
};

const changeNickname = (socket, originalNickname, nickname) => {
  socketsUsers[socket.id] = nickname;

  const index = users.indexOf(originalNickname);

  if (index >= 0) users[index] = nickname;
  if (index < 0) users.push(originalNickname);
};

io.on('connection', (socket) => {
  socket.emit('messageHistory', messages);
  socket.emit('userHistory', users);

  socket.on('message', ({ chatMessage, nickname }) => {
    const dateTime = getDateTime();

    messages.push(`${dateTime} - ${nickname}: ${chatMessage}`);
    io.emit('message', `${dateTime} - ${nickname}: ${chatMessage}`);
  });

  socket.on('changeNickname', ({ originalNickname, nickname }) => {
    changeNickname(socket, originalNickname, nickname);
    io.emit('changeNickname', users);
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'transport_error') console.log('Transport error');
    removeUser(socket);
    io.emit('changeNickname', users);
  });
});

app.get('/', async (_req, res) => {
  res.status(200).render('index');
});

http.listen(3000, () => {
  console.log('Escutando na porta 3000');
}); 