const socket = window.io();

const messageForm = document.querySelector('#messageForm');
const nickForm = document.querySelector('#nickForm');
const customAttr = 'data-testid';
const messageBox = document.querySelector('#messageBox');

const setUserName = (userName) => {
    const oldUserName = localStorage.getItem('userName');
    const newUserName = !userName ? Math.random().toString(36) : userName;
    localStorage.setItem('userName', newUserName);
    if (userName) {
        socket.emit('setup', { oldUserName, newUserName });
    }
    const nickNameLabel = document.querySelector('#nickname');
    nickNameLabel.innerText = `Current Nickname: ${newUserName}`;
    return newUserName;
};

setUserName();
messageBox.focus();

nickForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nicknameBox = document.querySelector('#change-nick-text');
    setUserName(nicknameBox.value);
    nicknameBox.value = '';
    return false;
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nickname = localStorage.getItem('userName');
    const chatMessage = messageBox.value;
    socket.emit('userMessage', { chatMessage, nickname });
    messageBox.value = '';
    return false;
});

const createMessage = (message) => {
    const messageList = document.querySelector('#messages');
    const messageItem = document.createElement('li');
    messageItem.setAttribute(customAttr, 'message');
    messageItem.innerText = message;
    messageList.appendChild(messageItem);
};

socket.on('message', (message) => createMessage(message));
