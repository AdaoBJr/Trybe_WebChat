const express = require('express');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000', // url aceita pelo cors
        methods: ['GET', 'POST'], // Métodos aceitos pela url
    },
});

const port = '3000';

let users = [];
const msgs = [];
let flag = false;

const sendMessage = (socket) => {
    socket.on('message', ({ nickname, chatMessage }) => {
        const date = new Date();
        const cdate = `${date.toISOString()}`.slice(0, 10).split('-').reverse().join('-');
        const ctime = String(date.toISOString()).slice(11, 19);
        const message = `${cdate} ${ctime} - ${nickname}: ${chatMessage}`;
        msgs.push(message);
        io.emit('message', message);
    });
};

const disconnect = (socket) => {
    socket.on('disconnect', () => {
        const disconected = socket.id.slice(0, 16);
        users = users.filter((online) => online.id !== disconected);
        io.emit('users', users);
    });
};

const allFlags = (socket) => {
    users.push({ nickname: undefined, id: socket.id.slice(0, 16) });
    if (!flag) { users.pop(); flag = true; }
    io.emit('id', socket.id.slice(0, 16));
    io.emit('msgs', msgs);
    io.emit('users', users.reverse());
};

const changeName = (socket) => {
    socket.on('nick', (nickname) => {
        const id = socket.id.slice(0, 16);
        users.forEach((u, i) => {
            if (id === u.id) { users[i].nickname = nickname; }
        });
        msgs.forEach((_u, i) => {
 msgs[i] = msgs[i].replace(id, nickname);
    });
    io.emit('id', nickname);
    io.emit('users', users);
    io.emit('msgs', msgs);
});
};

io.on('connection', (socket) => {
    allFlags(socket);
    sendMessage(socket);
    disconnect(socket);
    changeName(socket);
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/view/index.html`);
});

server.listen(port, () => {
    console.log('Ativo');
});