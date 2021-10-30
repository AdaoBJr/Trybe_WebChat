require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const moment = require('moment');
const { nickGenerator } = require('./src/functions/nickGenerator');

const pathViews = path.join(__dirname, 'src/views');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', pathViews);
app.use(
  cors({
    origin: `http://localhost${port}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization'],
  }),
);
app.get('/', (req, res) => {
  res.render('board');
});

io.on('connection', (socket) => {
  console.log(`Usuário conectado, ID: ${socket.id}`);
  const nick = nickGenerator();

  socket.on('send', (msg) => {
    const timeMsg = moment().local(true).format('DD-MM-yyyy hh:mm:ss A');
    console.log(timeMsg);

    const chatMessage = `${timeMsg} - ${nick}: ${msg}`;

    io.emit('send', chatMessage);
    console.log(`Eu sou o : ${nick} Id: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    socket.removeAllListeners();
 });
});

http.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
