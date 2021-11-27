const socket = window.io();

socket.on('joined', (randomUser) => {
    Object.entries(randomUser).forEach((user) => {
        const li = document.createElement('li');
        const liText = document.createTextNode(user[1]);
        li.setAttribute('data-testid', 'online-user');
        li.setAttribute('id', user[0]);
        li.append(liText);
        document.getElementById('online-user').appendChild(li);
    });
});

const nickBtn = document.getElementById('nick-btn');
const nickInput = document.getElementById('nick-input');

nickBtn.addEventListener('click', () => {
    const userLi = document.getElementById(socket.id);
    userLi.innerText = nickInput.value;
    socket.emit('updateNick', { nickname: nickInput.value, socketId: socket.id });
    nickInput.value = '';
});

const generateHistory = (data) => {
    const li = document.createElement('li');
    const liText = document.createTextNode(data);
    li.setAttribute('data-testid', 'message');
    li.append(liText);
    document.getElementById('messages').appendChild(li);
};

socket.on('message', generateHistory);
socket.on('histories', (data) => data.forEach((obj) => generateHistory(obj)));

const msgbtn = document.getElementById('send-btn');
msgbtn.addEventListener('click', () => {
    const text = document.getElementById('msg');
    const nickname = document.getElementById(socket.id).innerText;
    socket.emit('message', { chatMessage: text.value, nickname });
});
