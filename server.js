const express = require('express');
const cors = require('cors');
const path = require('path');
const moment = require('moment');

const app = express();
const http = require('http').createServer(app);

const PORT = 3000;

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const Models = require('./models');

const users = [];

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'views')));

const editedMessage = (chatMessage, nickname) => {
  const timestampMessage = moment().format('DD-MM-yyyy LTS');
  Models.createMessage({
    message: chatMessage,
    nickname,
    timestamp: timestampMessage,
  });
  io.emit('message', `${timestampMessage} - ${nickname}: ${chatMessage}`);
};

io.on('connection', (socket) => {
  socket.on('newUser', (nickname) => {
    users.push({
      userId: socket.id,
      nickname,
    });
    socket.broadcast.emit('newUser', nickname);
  });

  socket.on('onlineUsers', () => io.emit('onlineUsers', users));

  socket.on('message', ({ chatMessage, nickname }) => {
    editedMessage(chatMessage, nickname);
  });
});

app.get('/', async (_request, response) => {
  const messages = await Models.getAllMessage();
  response.render('index', { messages });
});

http.listen(PORT, () => {
  console.clear();
  console.log(`Ouvindo na porta ${PORT}`);
});
