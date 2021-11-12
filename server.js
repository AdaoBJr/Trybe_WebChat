require('dotenv').config();
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const moment = require('moment');

const PORT = process.env.PORT || 3000;

const usersOn = {};

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const { getMessage, postMessage } = require('./models/webChatModel');

app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', './views');

// função executada quando usuário se conecta
io.on('connection', async (socket) => {
  usersOn[socket.id] = socket.id.slice(0, 16);
  socket.on('disconnect', () => {
    delete usersOn[socket.id]; io.emit('users', Object.values(usersOn));
  });
  
  socket.on('message', async ({ chatMessage, nickname }) => {
    const dateNow = moment().format('DD-MM-YYYY HH:mm:ss');
    io.emit('message', `${dateNow} - ${nickname}: ${chatMessage}`);
    await postMessage({ chatMessage, nickname, dateNow });
  });

  socket.on('newNickname', (nickname) => {
    usersOn[socket.id] = nickname; io.emit('users', Object.values(usersOn));
  });

  const chatHistory = async () => {
    const messages = await getMessage();
    return messages;
  };
  io.emit('chatHistory', await chatHistory());
  io.emit('users', Object.values(usersOn));
});

app.get('/', (_req, res) => {
  res.render('index');
 });

http.listen(PORT, () => {
  console.log(`Rodando fino na porta ${PORT}`);
});
