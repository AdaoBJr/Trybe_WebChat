const socket = window.io();

const button = document.querySelector('#newMessage');
  
const setMessage = (message) => {
  const messageBox = document.querySelector('#messageBox');
  const li = document.createElement('li');
  li.innerHTML = message;
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

const firstLoad = (messages) => {
    console.log(messages[0]);
    const messageBox = document.querySelector('#messageBox');
    messages.forEach((e) => {
      const { timestamp, nickname, message } = e;
      const newMessage = `${timestamp} - ${nickname}: ${message}`;
      const li = document.createElement('li');
      li.setAttribute('data-testid', 'message');
      li.innerHTML = newMessage;
      messageBox.appendChild(li);
    });
};

socket.on('message', (message) => setMessage(message));
socket.on('connected', (messages) => firstLoad(messages));
