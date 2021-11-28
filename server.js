require('dotenv').config();
const express = require('express');

const { PORT } = process.env;

const app = express();
const http = require('http').createServer(app);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(`${__dirname}/views`));

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

// const userControllers = require('./controllers/userController');

const users = [];

io.on('connection', (socket) => {
  socket.on('userConnected', (nickname) => {
    users.push({ id: socket.id, nickname });
    io.emit('updateUsers', users);
  });
  
  socket.on('message', async ({ nickname, chatMessage }) => {
    const dateNow = new Date().toLocaleString().replace(/\//g, '-');
    // await userControllers.newMessage(nickname, chatMessage);
    io.emit('message', `${dateNow} ${nickname}: ${chatMessage}`);
  });
});

app.get('/', (req, res) => res.render(`${__dirname}/views/chat.ejs`));

http.listen(PORT, () => console.log(`Online on port ${PORT}`));
