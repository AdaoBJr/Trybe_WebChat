const socket = window.io();
  
socket.emit('joinRoom', nickname);

const form = document.querySelector('.message');
const inputMessage = document.querySelector('#messageInput');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { nickname, chatMessage: inputMessage.value });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

window.onbeforeunload = () => {
  socket.disconnect();
};