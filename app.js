require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http').createServer(express());
const { ChatServer } = require('./server/index');
const routes = require('./routes');

const io = socketIO(http, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const server = new ChatServer(io);
server.init();

class App {
  constructor() {
    this.app = express();
    this.http = http;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', './public');
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  routes() {
    this.app.use(routes);
  }
}

module.exports = new App().app;
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
