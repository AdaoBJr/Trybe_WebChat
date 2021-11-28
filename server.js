// Faça seu código aqui

require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

const server = require('http').createServer(app);

const urlOrigin = `http://localhost:${PORT}`;

const socket = require('socket.io')(server, {

  cors: {

    methods: ['GET', 'POST'],
    
    origin: urlOrigin,

  },

});

app.use(cors());

app.use(express.static(path.join(__dirname, 'views')));

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use('/', (requisition, response) => {
  response.render('index.ejs');
});

require('./sockets/chat.js')(socket);

server.listen(PORT, () => {
  console.log(`Metendo marcha na porta ${PORT}`);
});