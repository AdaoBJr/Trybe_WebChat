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

const chat = require('./sockets/chat');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
  res.status(200).render('chat');
});

chat(io);

server.listen(3000, () => {
  console.log('Ouvindo a porta 3000');
});
