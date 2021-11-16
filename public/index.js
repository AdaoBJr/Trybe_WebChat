const socket = window.io();

const button = document.getElementById('send-button');

button.addEventListener('click', () => {
  const chatMessage = document.querySelector('input[id=message-input').value;
  const nickname = document.querySelector('input[id=nickname-input').value;
  socket.emit('message', { chatMessage, nickname });
});

socket.on('message', (message) => {
  console.log(message);
});
