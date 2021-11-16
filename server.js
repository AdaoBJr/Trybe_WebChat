require('dotenv').config();
const express = require('express');
const http = require('http');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

const httpServer = http.createServer(app);

const io = require('socket.io')(httpServer, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

const { addMessage } = require('./models/messagesModel');
const { getAllMessages } = require('./controllers/messagesController');

app.use(express.static(`${__dirname}/views`));

app.get('/', (_req, res) => {
  res.render(`${__dirname}/views/index.ejs`);
});

app.get('/messages', getAllMessages);

let onlineUsers = [];

io.on('connection', (socket) => {
  socket.on('message', async ({
    chatMessage,
    nickname,
  }) => {
    const today = new Date().toLocaleString().replace(/\//g, '-');
    await addMessage({
      message: chatMessage,
      nickname,
      timestamp: today,
    });
    io.emit('message', `${today} - ${nickname}: ${chatMessage}`);
  });
});

io.on('connection', (socket) => {
  socket.on('newLogin', (nickname) => {
    onlineUsers.push({
      nickname,
      id: socket.id,
    });
    io.emit('userList', onlineUsers);
  });
});

io.on('connection', (socket) => {
  socket.on('newNickname', (nickname) => {
    onlineUsers = onlineUsers.map((user) => {
      if (user.id === socket.id) {
        return {
          nickname,
          id: socket.id,
        };
      }
      return user;
    });

    io.emit('userList', onlineUsers);
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id !== socket.id);

    io.emit('userList', onlineUsers);
  });
});

httpServer.listen(PORT, () => console.log(`listening on port ${PORT}`));