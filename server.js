const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const http = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000', // url aceita pelo cors
    methods: ['GET', 'POST'], // Métodos aceitos pela url
  } });

app.use(express.static(`${__dirname}/public`));

require('./sockets/chat')(io);

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (_req, res) => res.render('chat'));

http.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});