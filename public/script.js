const socket = window.io();

let nickname = '';

socket.on('connect', () => {
  nickname = socket.id.substr(0, 16);
  socket.emit('nickname', nickname);
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
  // return false;
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
  // userList.forEach(newUser);
  users.forEach((user) => newUser(user));
};

socket.on('message', (message) => newMessage(message));
socket.on('userList', (userList) => renderUserList(userList));
