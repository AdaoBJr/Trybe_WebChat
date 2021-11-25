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

const { newMessageService } = require('./services/webchat');
const { requestAllMessages } = require('./controllers/webchat');

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

io.on('connection', async (socket) => {
  console.log(`Socket conectado com ID: ${socket.id}`);
  socket.on('message', async ({ chatMessage, nickname }) => {
    await newMessageService(chatMessage, nickname);
    const messageFormated = toFormatMessage(chatMessage, nickname);
    io.emit('message', messageFormated);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const messages = await requestAllMessages();

  res.render('index', { messages });
});

app.get('/teste', requestAllMessages);

socketIoServer.listen(PORT, () => console.log(`listening on port ${PORT}`));