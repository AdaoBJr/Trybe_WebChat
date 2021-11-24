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
  li.innerText = user;
  ul.appendChild(li);
};

const btnNickname = document.querySelector('#btnNickname');
const inputUser = document.querySelector('#inputNickname');
btnNickname.addEventListener('click', () => {
  nickname = inputUser.value;
  socket.emit('users', nickname);
  inputUser.value = '';
});

socket.on('message', (message) => createMessage(message));

socket.on('users', (user) => createUser(user));

socket.on('connected', () => console.log('char.js'));