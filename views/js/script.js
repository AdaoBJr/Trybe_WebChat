const socket = window.io();

const nickname = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);

socket.emit('userConnected', nickname);

const messageInput = document.querySelector('#message-input');

document.querySelector('#send-message').addEventListener('click', (event) => {
  event.preventDefault();
  const chatMessage = messageInput.value;
  socket.emit('message', { nickname, chatMessage });
  messageInput.value = '';
});

const newMessage = (text) => {
  const message = document.createElement('li');
  message.setAttribute('data-testid', 'message');
  message.innerText = text;
  document.querySelector('#chat').appendChild(message);
};

socket.on('message', (text) => newMessage(text));
