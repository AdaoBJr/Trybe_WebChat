const express = require('express');

const app = express();
const http = require('http').createServer(app);
const moment = require('moment');
require('dotenv').config();

const port = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${port}`,
    methods: ['GET', 'POST'],
  },
});

// Fonte moment().format(): https://ifpb.github.io/jaguaribetech/2016/09/01/moment-js/#:~:text=Para%20rodar%20a%20Moment%20no,funcionalidades%20de%20manipula%C3%A7%C3%A3o%20de%20datas.
io.on('connection', (socket) => {
  socket.on('message', ({ chatMessage, nickname }) => {
    const date = moment().format('DD-MM-yyyy HH:mm:ss');
    io.emit('message', `${date} - ${nickname} - ${chatMessage}`);
    console.log(`Usuário conectado. ID: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
