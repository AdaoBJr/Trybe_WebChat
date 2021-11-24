// Faça seu código aqui - Iniciando o Webchat Project
const express = require('express');

const app = express();
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

const controller = require('./controllers/chatControllers');

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/views`));

require('./sockets/chat')(io);

// app.get('/', (req, res) => {
//   res.status(200).render('chat');
// });

app.get('/', async (_req, res) => {
  // res.sendFile(`${__dirname}/views/chat.html`);
  const getMessages = await controller.getAllMessages();
  const messages = getMessages.map(({ message, nickname, timeStamp }) => 
  `${timeStamp} - ${nickname}: ${message}`);
  res.render('chat', { messages });
 });

// app.get('/', (req, res) => {
//   res.sendFile(`${__dirname}/views/login.html`);
// });

http.listen(3000, () => {
  console.log('Servidor ouvindo a porta 3000');
});