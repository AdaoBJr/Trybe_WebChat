const express = require('express');

const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { webChatSocket } = require('./sockets');

webChatSocket(io);

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
const PORT = 3000;  
http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});