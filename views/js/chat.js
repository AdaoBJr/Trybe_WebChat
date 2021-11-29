window.onload = () => {};
const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

const nickNameRandom = Math.random().toString(36).substring(2, 10)
+ Math.random().toString(36).substring(2, 10);

const messageForm = document.querySelector('#message-form');
const nickNameForm = document.querySelector('#nickname-form');
const inputMessage = document.querySelector('#message-box');
const inputNickname = document.querySelector('#nickname-box');
const newNickName = document.querySelector('#online-user');

function setNickname() {
  const nickName = nickNameRandom;
  sessionStorage.setItem('Nickname', nickName);
}

nickNameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sessionStorage.setItem('Nickname', inputNickname.value);
  inputNickname.value = '';
  return false;
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = sessionStorage.getItem('Nickname');
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messages = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messages.appendChild(li);
};

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('listMessages', (messageList) => {
  messageList.map((message) => createMessage(message));
});

socket.on('connect', () => {
  setNickname();
  newNickName.innerHTML = nickNameRandom;
});
