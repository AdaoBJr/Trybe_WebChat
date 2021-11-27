require('dotenv').config();

const express = require('express');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  res.status(200).render('chat');
});

io.on('connection', (socket) => {
  console.log('Connected user');
  socket.on('disconnect', () => {
    console.log('Disconnected user');
  });
  socket.on('message', (msg) => {
    const date = new Date();
    const [year, day, month] = [date.getFullYear(), date.getDate(), date.getMonth()];
    const [hour, minute, second] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    // DD-MM-yyyy HH:mm:ss
    const messageTime = `${day}-${month + 1}-${year} ${hour}:${minute}:${second}`;
    const formattedMessage = `${messageTime} - ${msg.nickname}: ${msg.chatMessage}`;
    io.emit('message', formattedMessage);
    console.log(formattedMessage);
  });
});

server.listen(3000, () => {
  console.log('Ouvindo a porta 3000');
});
