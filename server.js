// Faça seu código aqui
require('dotenv').config();

const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors');
const moment = require('moment');

const PORT = process.env.PORT || 3000;

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', './views');

const io = require('socket.io')(http, {
  cors: {
    origin: `http://localhost:${PORT}`,
    method: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.render(`${__dirname}/views/index.ejs`);
});

io.on('connection', (socket) => {
  console.log('Alguém se conectou');
  socket.on('message', ({
    nickname,
    chatMessage,
  }) => {
    const date = moment().format('DD-MM-YYYY HH:mm:ss'); // DD-MM-yyyy HH:mm:ss ${nickname} ${chatMessage}
    io.emit('message', `${date} - ${nickname}: ${chatMessage}`);
    // console.log(date);
  });
});

http.listen(PORT, () => console.log(`listening on port ${PORT}`));
