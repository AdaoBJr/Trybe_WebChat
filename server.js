const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 3000;
const app = express();

const socketIoServer = require('http').createServer(app);

const io = require('socket.io')(socketIoServer, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ['GET', 'POST'],
  },
});

// const model = require('./models/data');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require('./sockets/backEnd')(io);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => res.render('webchat'));

socketIoServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});