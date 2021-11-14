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

const usuarios = [];

const searchIndex = (socket) => usuarios.findIndex((element) => element.id === socket.id);

io.on('connection', (socket) => {
  console.log(`Usuário conectado ${socket.id}`);
  
  socket.on('message', ({ chatMessage, nickname }) => {
    io.emit('message', create(chatMessage, nickname));
  });
  
  socket.on('online', (user) => {
    usuarios.push({ id: socket.id, nickname: user });
    io.emit('usuarios', usuarios);
  });
  
  socket.on('mudarNome', (newNickName) => {
    if (searchIndex(socket) !== -1) usuarios.splice(searchIndex(socket), 1);
    usuarios.push({ id: socket.id, nickname: newNickName });
    io.emit('usuarios', usuarios);
  });
  
  socket.on('disconnect', () => {
    if (searchIndex(socket) !== -1) usuarios.splice(searchIndex(socket), 1);
    io.emit('usuarios', usuarios);
  });
});

http.listen(PORT, () => console.log(`rodando no endereço http://localhost:${PORT}`)); 
