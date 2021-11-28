require('dotenv').config();
const express = require('express');
const { StatusCodes } = require('http-status-codes');

const PORT = process.env.PORT || 3000;

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/views`));

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const webchatControllers = require('./controllers/webchatControllers');

const users = [];

const dateNow = new Date().toLocaleString().replace(/\//g, '-');

io.on('connection', (socket) => {
  socket.on('userConnected', (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });
  
  socket.on('message', async ({ nickname, chatMessage }) => {
    await webchatControllers.newMessage(chatMessage, nickname, dateNow);
    io.emit('message', `${dateNow} ${nickname}: ${chatMessage}`);
  });
  
  socket.on('changeNickname', ({ nickname, lastNickname }) => {
    const user = users.findIndex((item) => item.nickname === lastNickname);
    users.splice(user, 1, { id: socket.id, nickname });
  io.emit('updateUsers', users);
  });
  
  socket.on('disconnect', ({ id }) => {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
    io.emit('updateUsers', users);
  });
});

app.get('/messages', async (req, res) => {
  try {
    const messages = await webchatControllers.getAllMessages();
    if (!messages) return res.status(StatusCodes.NOT_FOUND).json(messages); 
    return res.status(StatusCodes.OK).json(messages);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error });
  }
});

app.get('/', (req, res) => res.render(`${__dirname}/views/chat.ejs`));

http.listen(PORT, () => console.log(`Online on port ${PORT}`));
