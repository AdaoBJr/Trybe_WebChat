require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');

const io = require('socket.io')(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { ChatServer } = require('./server/index');

const server = new ChatServer(io);

server.init();

app.set('view engine', 'ejs');
app.set('views', './public');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (_req, res) => {
  res.status(200).render('index');
});

module.exports = http;
// // Faça seu código aqui
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const socketio = require('socket.io');
// const path = require('path');
// const routes = require('./routes');
// const Server = require('./server/index');

// class App {
//   constructor() {
//     this.express = express();
//     this.middlewares();
//     this.routes();
//     this.server = http.createServer(this.express);
//     this.io = socketio(this.server, {
//       cors: {
//         origin: 'https://localhost:3000',
//         methods: ['GET', 'POST'],
//       },
//     });
//   }

//   middlewares() {
//     this.express.set('view engine', 'ejs');
//     this.express.set('views', path.join(__dirname, './public'));
//     this.express.use(cors());
//     this.express.use(express.json());
//     this.express.use(express.static(path.join(__dirname, 'public')));
//   }

//   routes() {
//     this.express.use(routes);
//   }
// }

// module.exports = new App();
