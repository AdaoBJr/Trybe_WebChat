const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const app = express();

const http = require('http').createServer(app);

const messageController = require('./controllers/messageController');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.set('views', './views');

const io = socket(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

app.use(express.static(`${__dirname}/views`));

require('./sockets/chat')(io);

app.get('/', (_req, res) => res.render('chat'));

app.post('/message', messageController.addMessage);

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});