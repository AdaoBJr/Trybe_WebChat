const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const socketIoServer = require('http').createServer(app);
const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: `http://localhost${PORT}`,
    methods: ['GET', 'POST'],
  },
});

const messages = [{ nickname: 'Thiago Leite', chatMessage: 'teste' }];

io.on('connection', (socket) => {
  console.log(`Socket conectado com ID: ${socket.id}`);
  socket.on('message', (data) => {
    console.log(messages);
    messages.push(data);
    io.emit('message', messages);
  });
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { messages });
});

socketIoServer.listen(PORT, () => console.log(`listening on port ${PORT}`));