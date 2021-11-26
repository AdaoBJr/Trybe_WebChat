const moment = require('moment');
const chatDB = require('../models/Chat');

class ChatServer {
  constructor(io) {
    this.io = io;
    this.users = [];
    this.messages = [];
    this.init();
  }

  newMessage(socket) {
    socket.on('message', async ({ chatMessage, nickname }) => {
      const time = moment().format('DD-MM-yyyy h:mm:ss A');
      const formatMessage = `${time} - ${nickname}: ${chatMessage}`;
      this.io.emit('message', formatMessage);
      await chatDB.newMessage(chatMessage, nickname, time);
    });
  }

  checkNickname(nickname, socket) {
    if (!this.users.includes(nickname)) {
      this.users.push({ name: nickname, id: socket.id });
    }
    return nickname;
  }

  // init() {
  //   this.io.on('connection', (socket) => {
  //     socket.on('user:login', (user) => {
  //       this.users[user.id] = user;
  //       socket.user = user;
  //       socket.join(user.id);
  //       this.io.emit('user:login', user);
  //       this.io.emit('user:list', this.users);
  //       this.io.emit('channel:list', this.channels);
  //       this.io.emit('message:list', this.messages);
  //     });

  //     socket.on('channel:create', (channel) => {
  //       this.channels[channel.id] = channel;
  //       socket.join(channel.id);
  //       this.io.emit('channel:create', channel);
  //       this.io.emit('channel:list', this.channels);
  //     });

  //     socket.on('channel:join', (channel) => {
  //       socket.join(channel.id);
  //       this.io.emit('channel:join', channel);
  //       this.io.emit('channel:list', this.channels);
  //     });

  //     socket.on('message:create', (message) => {
  //       message.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  //       this.messages.push(message);
  //       this.io.emit('message:create', message);
  //       this.io.emit('message:list', this.messages);
  //     });

  //     socket.on('disconnect', () => {
  //       this.io.emit('user:logout', socket.user);
  //       delete this.users[socket.user.id];
  //       this.io.emit('user:list', this.users);
  //     });
  //   });
  // }
}

module.exports = ChatServer;