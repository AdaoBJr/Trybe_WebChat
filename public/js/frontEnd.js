const socket = window.io();

socket.on('joined', (randomUser) => {
    Object.values(randomUser).forEach((user) => {
        const li = document.createElement('li');
        const liText = document.createTextNode(user);
        li.append(liText);
        document.getElementById('online-user').appendChild(li);
    });
});

// const nickBtn = document.getElementById('nick-btn');

// nickBtn.addEventListener('click', () => {
//     const nickInput = document.getElementById('nick-input');
//     socket.emit('updateNick', { nickname: nickInput.value });
// });

socket.on('message', (data) => {
    const li = document.createElement('li');
    const liText = document.createTextNode(data);

    li.append(liText);
    document.getElementById('messages').appendChild(li);
});

const btn = document.getElementById('send-btn');

btn.addEventListener('click', () => {
    const text = document.getElementById('msg');
    socket.emit('message', { chatMessage: text.value });
});
