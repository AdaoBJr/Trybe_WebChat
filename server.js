// Faça seu código aqui
const app = require('express')();
const http = require('http').createServer(app);
const { instrument } = require('@socket.io/admin-ui');
const cors = require('cors');
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000', 'https://admin.socket.io/'],
    methods: ['GET', 'POST'],
  },
});

const { create } = require('./mensagem.js');

require('dotenv').config();

instrument(io, { auth: false });

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cors());

app.get('/', (_, res) => {
  res.render('sala');
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado ${socket.id}`);

  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', create(chatMessage, nickname));
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} saiu`);
  });
});

http.listen(PORT, () => console.log(`rodando no endereço http://localhost:${PORT}`)); 
