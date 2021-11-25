// setting up application like Doc: https://socket.io/get-started/chat#the-web-framework
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const ChatController = require('./controllers/chatController');

let usersLogedIn = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/views', express.static('views'));

app.get('/', ChatController.chat);

const removeUser = (id) => {
  usersLogedIn = usersLogedIn.filter((user) => user.id !== id);
};

const addUser = (id, nickname) => {
  usersLogedIn = [
    ...usersLogedIn,
    {
      id,
      nickname,
    },
  ];
};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('userlogedin', (nickname) => {
    addUser(socket.id, nickname);
    io.emit('userloged', usersLogedIn);
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('userloged', usersLogedIn);
  });

  socket.on('message', (message) => {
    const { nickname, chatMessage } = message;
    // date & time source: https://phoenixnap.com/kb/how-to-get-the-current-date-and-time-javascript
    const today = new Date();
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const messageData = `${date} ${time} - ${nickname}: ${chatMessage}`;

    io.emit('message', messageData);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
