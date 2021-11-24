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
  let cryptoNick = socket.id.substring(socket.id.length - 16); 
  nick.push(cryptoNick);
  socket.emit('nickId', cryptoNick);
  io.emit('onlineNicks', nick);

  socket.on('message', async ({ nickname, chatMessage }) => { 
    const resp = `${data} - ${nickname}: ${chatMessage}`;
    await ChatModel.addMsg({ message: chatMessage, nickname, timestamp: data });
    io.emit('message', resp);
  });

  socket.on('changeNick', ({ oldNick, newNick }) => {
    nick.splice(nick.indexOf(oldNick), 1, newNick); 
    cryptoNick = newNick;
    io.emit('onlineNicks', nick);
  });

  socket.on('disconnect', () => { 
    nick.splice(nick.indexOf(cryptoNick), 1); 
    io.emit('onlineNicks', nick);
  });
});

app.get('/', async (req, res) => {
  const arrayMessages = await ChatModel.getAll();

  res.status(200).render('index.ejs', { arrayMessages });
});

http.listen(3000, () => console.log('Rodando na porta 3000'));
