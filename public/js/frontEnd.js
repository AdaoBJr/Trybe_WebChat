const socket = window.io();

socket.on('joined', (randomUser) => {
    Object.entries(randomUser).forEach((user) => {
        console.log(user);
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

socket.on('message', (data) => {
    const li = document.createElement('li');
    const liText = document.createTextNode(data);
    li.append(liText);
    document.getElementById('messages').appendChild(li);
});

const btn = document.getElementById('send-btn');

btn.addEventListener('click', () => {
    const text = document.getElementById('msg');
    socket.emit('message', { chatMessage: text.value, socketId: socket.id });
});
