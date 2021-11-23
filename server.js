const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

moment.locale();

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET'],
  },
});

const ChatModel = require('./models/chat');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
  }),
);

const nick = [];
const data = `${moment().format('DD-MM-YYYY')} ${moment().format('LTS')}`;
io.on('connection', (socket) => { 
  let socketId = socket.id.substring(socket.id.length - 16); nick.push(socketId);
  socket.emit('nickId', socketId);
  socket.broadcast.emit('otherNickId', nick);

  socket.on('message', async ({ nickname, chatMessage }) => { 
    const resp = `${data} - ${nickname}: ${chatMessage}`;
    const obj = { message: chatMessage, nickname, timestamp: data };
    await ChatModel.addMsg(obj);
    io.emit('message', resp);
  });

  socket.on('changeNick', ({ oldNick, newNick }) => {
    nick.splice(nick.indexOf(oldNick), 1, newNick); socketId = newNick;
    socket.broadcast.emit('otherNickId', nick);
    io.emit('changeNick', { oldNick, newNick });
  });

  socket.on('disconnect', () => { 
    nick.splice(nick.indexOf(socketId), 1); 
    socket.broadcast.emit('otherNickId', nick);
  });
});

app.get('/', async (req, res) => {
  const arrayMessages = await ChatModel.getAll();

  res.status(200).render('index.ejs', { arrayMessages, nick });
});

http.listen(3000, () => console.log('Rodando na porta 3000'));
