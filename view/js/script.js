const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const messageInput = document.querySelector('#messageInput');
const nicknameInput = document.querySelector('#nicknameInput');
const chooseNickname = document.querySelector('#chooseNickname');
const userNickname = document.querySelector('#userNickname');
const messages = document.querySelector('#messages');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const nickRandomico = () => {
  let id = '';
  const alphabet = 'abcdefghijklmnopqrstuvwyxz';
  alphabet.split('').forEach(() => {
    if (id.length !== 16) {
      id += alphabet[Math.floor(Math.random() * (alphabet.length - 1))];
    }
  });
  return id;
};

let nickname = nickRandomico();

chooseNickname.addEventListener('click', () => {
  nickname = nicknameInput.value;
  userNickname.textContent = nickname;
});

sendButton.addEventListener('click', () => {
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
});

socket.on('message', (mensRecebida) => {
  const message = document.createElement('li');
  message.textContent = mensRecebida;
  message.setAttribute('data-testid', 'message');
  messages.appendChild(message);
});

window.onload = () => {};
