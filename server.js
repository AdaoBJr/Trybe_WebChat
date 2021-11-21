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

const messages = [];

const dateFormater = () => {
  const today = new Date();
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return today.toLocaleDateString('pt-br', options);
};

io.on('connection', (socket) => {
  console.log(`Socket conectado com ID: ${socket.id}`);
  socket.on('message', ({ chatMessage, nickname }) => {
    const messageFormated = `${dateFormater()} - ${nickname}: ${chatMessage}`;
    messages.push(messageFormated);
    io.emit('message', messageFormated);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { messages });
});

socketIoServer.listen(PORT, () => console.log(`listening on port ${PORT}`));