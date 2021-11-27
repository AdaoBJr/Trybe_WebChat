const socket = window.io();

// Source: https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/#:~:text=Child%20nodes%20can%20be%20removed,which%20produces%20the%20same%20output.
const createUsersList = (userList) => {
    const ul = document.querySelector('#online-user');
    let child = ul.lastElementChild; 
        while (child) {
            ul.removeChild(child);
            child = ul.lastElementChild;
        }
    Object.entries(userList).forEach((user) => {
        const li = document.createElement('li');
        const liText = document.createTextNode(user[1]);
        li.setAttribute('data-testid', 'online-user');
        li.setAttribute('id', user[0]);
        li.append(liText);
        document.getElementById('online-user').appendChild(li);
    });
};

socket.on('joined', createUsersList);
socket.on('newUser', createUsersList);
socket.on('changeAllNick', createUsersList);

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

socket.on('userDisconected', (userId) => {
    const userLi = document.getElementById(userId);
    userLi.remove();
});
