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

io.on('connection', (socket) => {
    socket.on('message', ({ nickname, chatMessage }) => {
        const date = new Date();
        const cdate = `${date.toISOString()}`.slice(0, 10).split('-').reverse().join('-');
        const ctime = String(date.toISOString()).slice(11, 19);

        const message = `${cdate} ${ctime} - ${nickname}: ${chatMessage}`;
        io.emit('message', message);
    });
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/view/index.html`);
});

server.listen(port, () => {
    console.log('Ativo');
});
