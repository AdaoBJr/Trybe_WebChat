const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const messageInput = document.querySelector('#messageInput');
const nicknameInput = document.querySelector('#nicknameInput');
const chooseNickname = document.querySelector('#chooseNickname');
const userNickname = document.querySelector('#userNickname');
const messages = document.querySelector('#messages');

const generateNickname = () => {
  let id = '';
  const alphabet = 'abcdefghijklmnopqrstuvwyxz';
  alphabet.split('').forEach(() => {
    if (id.length !== 16) {
      id += alphabet[Math.floor(Math.random() * (alphabet.length - 1))];
    }
  });
  return id;
};

let nickname = generateNickname();

chooseNickname.addEventListener('click', () => {
  nickname = nicknameInput.value;
  userNickname.textContent = nickname;
});

sendButton.addEventListener('click', () => {
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
});

socket.on('message', (receivedMessage) => {
  const message = document.createElement('li');
  message.textContent = receivedMessage;
  message.setAttribute('data-testid', 'message');
  messages.appendChild(message);
});

window.onload = () => {
  userNickname.textContent = nickname;
};
