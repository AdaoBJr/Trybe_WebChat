// Faça seu código aqui - OK, iniciando projeto!
// Sua aplicação deve ser inicializada no arquivo server.js;
const express = require('express');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`, 
    methods: ['GET', 'POST'],
  },
});

const { router } = require('./controllers/messages');

app.use('/messages', router);
app.use('/', express.static(`${__dirname}/view/`));

require('./sockets/messages')(io);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/view/index.html`);
});

http.listen(PORT, () => console.log(PORT));
