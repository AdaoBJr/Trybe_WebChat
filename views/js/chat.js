window.onload = () => {};
const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

// const nickNameRandom = Math.random().toString(36).substring(2, 10)
// + Math.random().toString(36).substring(2, 10);

const form = document.querySelector('form');
const inputMessage = document.querySelector('#message-box');
const inputNickname = document.querySelector('#nickname-box');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, nickname: inputNickname.value });
  inputMessage.value = '';
  return false;
});

const createMessage = ({ message }) => {
  const messages = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messages.appendChild(li);
};

socket.on('message', (message) => {
  createMessage({ message });
});
