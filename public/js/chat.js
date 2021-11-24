const socket = window.io();

let nickname;

const createMessage = (message) => {
  const ul = document.querySelector('#message');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  ul.appendChild(li);
};

const btnMessage = document.querySelector('#btnMessage');
const inputMessage = document.querySelector('#inputMessage');
btnMessage.addEventListener('click', () => {
  const message = inputMessage.value;
  socket.emit('message', { chatMessage: message, nickname });
  inputMessage.value = '';
});

const createUser = (user) => {
  const ul = document.querySelector('#user');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', user.userID);
  nickname = user.nickname;
  li.innerText = nickname;
  ul.appendChild(li);
};

const updateUser = (newNickname) => {
  console.log(newNickname);
  const li = document.getElementById(newNickname.userID);
  if (socket.id === newNickname.userID) nickname = newNickname.nickname;
  li.innerText = newNickname.nickname;  
};

const btnNickname = document.querySelector('#btnNickname');
const inputUser = document.querySelector('#inputNickname');
btnNickname.addEventListener('click', () => {
  nickname = inputUser.value;
  socket.emit('users', { nickname: inputUser.value, userID: socket.id });
  inputUser.value = '';
});

socket.on('users', (user) => createUser(user));
socket.on('message', (message) => createMessage(message));
socket.on('nickname', (newNickname) => updateUser(newNickname));
socket.on('newConnection', (historic) => historic
  .forEach((message) => createMessage(message)));