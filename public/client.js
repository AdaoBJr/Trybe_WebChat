const socket = window.io();

let nickname = '';

const createNickname = () => {
  const createdNickname = sessionStorage.getItem('createdNickname');
  if (createdNickname) {
    nickname = createdNickname;
  } else {
    nickname = socket.id.substr(0, 16);
  }
  socket.emit('nickname', nickname);
};

socket.on('connect', () => {
  createNickname();
});

const userForm = document.getElementById('user-form');
const nicknameInput = document.getElementById('nickname-input');

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: messageInput.value, nickname });
  messageInput.value = '';
});

const newMessage = (message) => {
  const messageList = document.querySelector('#message-list');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messageList.appendChild(li);
};

userForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('newNickname', nicknameInput.value);
  nickname = nicknameInput.value;
  nicknameInput.value = '';
  sessionStorage.setItem('createdNickname', nickname);
});

const newUser = (nick) => {
  const userList = document.querySelector('#user-list');
  const li = document.createElement('li');
  li.innerText = nick;
  li.setAttribute('data-testid', 'online-user');
  userList.appendChild(li);
};

const renderUserList = (users) => {
  const userList = document.querySelector('#user-list');
  userList.innerHTML = '';
  users.sort((a, b) => {
    if (a.id === socket.id) return -1;
    if (b.id === socket.id) return 1;
    return 0;
  });
  
  users.forEach((user) => newUser(user.name));
};

const renderMessageList = (messages) => {
  messages.forEach((message) => {
    const formatMessage = `${message.timestamp} - ${message.nickname}: ${message.message}`;
    newMessage(formatMessage);
  });
};

socket.on('message', (message) => newMessage(message));
socket.on('userList', (userList) => renderUserList(userList));
socket.on('messageList', (messages) => renderMessageList(messages));

socket.on('disconnect', () => {
  socket.on('userList', (users) => {
    renderUserList(users);
  });
});