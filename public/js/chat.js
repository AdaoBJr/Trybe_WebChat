const socket = window.io();

const button = document.querySelector('#newMessage');
  
const setMessage = (messages) => {
  const messageBox = document.querySelector('#messageBox');
  const li = document.createElement('li');
  li.innerHTML = messages;
  messageBox.appendChild(li);
};

button.addEventListener('click', () => {
  const nickname = document.querySelector('#userName').value;
  const newUserMessage = document.querySelector('#newUserMessage');
  const message = { chatMessage: newUserMessage.value, nickname };
  socket.emit('message', message);
  newUserMessage.value = '';
  return false;
});

socket.on('message', (message) => setMessage(message));
