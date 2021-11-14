// Faça seu código aqui

const express = require('express');
const socket = require('socket.io');
const formatMessage = require('./views/js/utils/format');
const newDate = require('./views/js/utils/getDate');
const { createMessage, getAllMessages } = require('./controllers/webChatController');

// App setup
const PORT = 3000;
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static(`${__dirname}/views`));
app.set('view engine', 'ejs');
app.set('views', './views');

// Socket setup
const io = socket(server);

let activeUsers = [];

io.on('connection', async (socketClient) => {
  socketClient.on('new user', (data) => {
    activeUsers.push({ data, id: socketClient.id }); io.emit('new user', activeUsers);
  });
  
  // Tive ajuda de Lucas Lotar
  socketClient.on('changeUser', ({ oldNickname, newNickname }) => {
    if (activeUsers.findIndex((obj) => obj.data === oldNickname) !== -1) {
      activeUsers[activeUsers.findIndex((obj) => obj.data === oldNickname)
      ] = { data: newNickname, id: socketClient.id }; io.emit('changeUser', activeUsers); 
    }
  });

  socketClient.on('disconnect', () => {
    const news = activeUsers.find((user) => user.id === socketClient.id);
    activeUsers = activeUsers.filter((e) => e.id !== socketClient.id); io.emit('user discon', news);
  });

  socketClient.on('message', async ({ chatMessage, nickname }) => {
    const dateHour = newDate(); const message = formatMessage(chatMessage, nickname, dateHour);
    await createMessage({ dateHour, nickname, chatMessage }); io.emit('message', message);
  });
  
  // Tive ajuda de Renan Braga
  const AllMessage = await getAllMessages(); socketClient.emit('allMessage', AllMessage);
});

app.get('/', (req, res) => res.status(200).render('index'));
