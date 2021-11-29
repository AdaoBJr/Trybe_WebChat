const socket = window.io();

const sendButton = document.querySelector('#sendButton');
const messageInput = document.querySelector('#messageInput');
const nicknameInput = document.querySelector('#nicknameInput');
const chooseNickname = document.querySelector('#chooseNickname');
const userNickname = document.querySelector('#userNickname');
const messageList = document.querySelector('#messages');
const onlineUsers = document.querySelector('#onlineUsers');

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
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
  const oldNickname = nickname;
  const newNickname = nicknameInput.value;
  nickname = nicknameInput.value;
  userNickname.textContent = nickname;
  socket.emit('changeNicknames', { oldNickname, newNickname });
});

sendButton.addEventListener('click', () => {
  const chatMessage = messageInput.value;
  socket.emit('message', { chatMessage, nickname });
});

const createMessage = (text) => {
  const message = document.createElement('li');
  message.textContent = text;
  message.setAttribute('data-testid', 'message');
  messageList.appendChild(message);
};

const renderMessages = (messages) => {
  messages.forEach((message) => {
    createMessage(message);
  });
};

const getMessages = async () => {
  fetch('http://localhost:3000/messages')
    .then((data) => data.json())
    .then((result) => renderMessages(result));
};

const createNickname = (nick, myNickname) => {
  const li = document.createElement('li');
  li.textContent = nick;
  if (myNickname === nickname) {
    li.setAttribute('data-testid', 'online-user');
  }
  onlineUsers.appendChild(li);
};

const renderArrayNicknames = (arr) => {
  onlineUsers.innerHTML = '';
  arr.forEach((nick) => {
    createNickname(nick, nickname);
  });
};

socket.on('message', (receivedMessage) => {
  createMessage(receivedMessage);
});

socket.on('updateNicknames', (nicknames) => {
  const orderedNicknames = nicknames.filter((el) => el !== nickname);
  orderedNicknames.unshift(nickname);
  renderArrayNicknames(orderedNicknames);
});

window.onload = async () => {
   userNickname.textContent = nickname;
   socket.emit('logged', nickname);
  await getMessages();
   };
