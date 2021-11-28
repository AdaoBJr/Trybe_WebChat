const express = require('express');
const cors = require('cors');

const app = express();
const http = require('http').createServer(app);

app.use(cors());
app.use(express.json());

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const now = require('./utils/now');

io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const message = `${now} - ${nickname}: ${chatMessage}`;
    console.log(message);
    io.emit('message', message);
  });
});

const PORT = '3000';

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/view/index.html`);
});

http.listen(PORT, () => {
  console.log('Online');
});
