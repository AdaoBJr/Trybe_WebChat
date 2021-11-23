const express = require('express');
const { read, write } = require('./models/message');

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
let msgs = [];

const sendMessage = (socket) => {
    socket.on('message', async ({ nickname, chatMessage }) => {
        const date = new Date();
        const cdate = `${date.toISOString()}`.slice(0, 10).split('-').reverse().join('-');
        const ctime = String(date.toISOString()).slice(11, 19);
        const message = `${cdate} ${ctime} - ${nickname}: ${chatMessage}`;
        msgs.push({ chatMessage, nickname, time: `${cdate} ${ctime}`, id: socket.id });
        await write({ chatMessage, nickname, time: `${cdate} ${ctime}`, id: socket.id })
        io.emit('message', message);
    });
};

const disconnect = (socket) => {
    socket.on('disconnect', () => {
        const disconected = socket.id;
        users = users.filter((online) => online.id !== disconected);
        io.emit('users', users);
    });
};

const allFlags = (socket) => {
    users.push({ nickname: undefined, id: socket.id });
    // if (!flag) { users.pop(); flag = true; }
    io.emit('msgs', msgs);
    io.emit('users', users.reverse());
};

const changeName = (socket) => {
    socket.on('nick', (nickname) => {
        const { id } = socket;
        users.forEach((u, i) => {
            if (u.id === id) {
                users[i].nickname = nickname;
            }
        });
        msgs.forEach((msg, i) => {
            if (msg.id === id) { msgs[i].nickname = nickname; }
        });

        io.emit('users', users);
        io.emit('msgs', msgs);
    });
};

io.on('connection', async (socket) => {
    const m = await read();
    msgs = m || [];
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