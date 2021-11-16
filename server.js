const express = require('express');
// https://socket.io/docs/v4/server-initialization/#with-express
const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { createMessage, getAllMessages } = require('./controllers/chatController');

app.use(express.json());
app.use(express.static(`${__dirname}/views`));

app.get('/', (req, res) => {
  res.render(`${__dirname}/views`);
});

let userList = [];

io.on('connection', async (socket) => {
  socket.on('userOnline', async ({ nickname }) => {
    userList = userList.filter(({ id }) => id !== socket.id);
    userList.push({ nickname, id: socket.id });
    io.emit('userOnline', userList);
    return userList;
  });

  socket.on('message', async (message) => {
    const { chatMessage, nickname } = message;
    const dateNow = new Date().toLocaleString().replace(/\//g, '-');
    createMessage({ dateNow, nickname, chatMessage });
    io.emit('message', `${dateNow} - ${nickname} ${chatMessage}`);
  });

  const getAllMessage = await getAllMessages();
  socket.emit('allMessage', getAllMessage);

  socket.on('disconnect', () => {
    userList = userList.filter(({ id }) => id !== socket.id);
    io.emit('userOnline', userList);  
  });
});

http.listen(3000, () => {
  console.log('rodando na porta 3000');
});