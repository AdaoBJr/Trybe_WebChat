require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// const path = require('path');

const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/views`));
// app.set('views', path.join(__dirname, 'views'));

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require('./sockets/chat')(io);

app.get('/', (_req, res) => {
  res.status(200).render('index');
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});