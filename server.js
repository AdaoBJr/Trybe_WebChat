const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const socketIoServer = require('http').createServer(app);
const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: `http://localhost${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const { newMessageService, allMessagesService } = require('./services/webchat');

const dateFormater = () => {
  const today = new Date();
  const dateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  return today.toLocaleDateString('pt-br', dateOptions).replace(/\//g, '-');
};

const hourFormater = () => {
  const today = new Date();

  return `${today.toLocaleTimeString('en-us')}`;
};

function toFormatMessage(chatMessage, nickname) {
  return `${dateFormater()} ${hourFormater()} - ${nickname}: ${chatMessage}`;
}

const nickInfo = [];

io.on('connection', (socket) => {
  socket.on('message', async ({ chatMessage, nickname }) => {
    await newMessageService(chatMessage, nickname);
    const messageFormated = toFormatMessage(chatMessage, nickname);
    io.emit('message', messageFormated);
  });
  socket.on('disconnect', (data) => {
    nickInfo.filter(({ id }) => id !== data.id);
  });
  socket.on('newuser', (data) => {
    nickInfo.push(data);
    io.emit('usersonline', nickInfo);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const messages = await allMessagesService();

  res.render('index', { messages });
});

socketIoServer.listen(PORT, () => console.log(`listening on port ${PORT}`));