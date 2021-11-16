const socket = window.io();

const logo = document.querySelector('.logo');
const allMessages = document.querySelector('.all-messages');
const userArea = document.querySelector('.logged-user');
const newNicknameInput = document.querySelector('.nickname-input');
const newNicknameButton = document.querySelector('.nickname-button');
const newMessageInput = document.querySelector('.new-message-input');
const newMessageButton = document.querySelector('.send-message-button');

const TEST_ID = 'data-testid';

// creates the nickname div
const printNickname = (nickname, boolean) => {
  const div = document.createElement('div');
  div.setAttribute('class', 'userDiv');
  const online = document.createElement('div');
  online.setAttribute('class', 'neonText');
  const userNickname = document.createElement('h1');
  userNickname.setAttribute('class', 'user-nickname');
  userNickname.setAttribute(TEST_ID, 'online-user');
  userNickname.innerText = nickname;
  div.prepend(userNickname);
  div.prepend(online);
  if (boolean) {
    div.setAttribute('class', 'userDiv mainUser');
    userArea.prepend(div);
  } else {
    userArea.appendChild(div);
  }
  return false;
};

// send the message and nickname to the server
newMessageButton.addEventListener('click', (e) => {
  e.preventDefault();
  const nickname = document.querySelector('.mainUser').innerText;
  const chatMessage = newMessageInput.value;
  socket.emit('message', {
    chatMessage,
    nickname,
  });
  newMessageInput.value = '';
  return false;
});

// EasterEgg
logo.addEventListener('click', (_e) => {
  socket.emit('message', {
    chatMessage: 'Você achou o EasterEgg!!!',
    nickname: 'Purple',
  });
  return false;
});

// receives the message from the server and prints on the Message Board
socket.on('message', (string) => {
  const messageDiv = document.createElement('div');
  messageDiv.innerText = string;
  messageDiv.setAttribute(TEST_ID, 'message');
  messageDiv.setAttribute('class', 'message');
  // to use after finish the project
  // allMessages.prepend(messageDiv);
  // used to pass the req2
  allMessages.append(messageDiv);
});

// send the new nickname to the server
newNicknameButton.addEventListener('click', (e) => {
  e.preventDefault();
  const nickname = newNicknameInput.value;
  socket.emit('newNickname', nickname);
  return false;
});

// receives the users Array and prints on the Online Users Board
socket.on('userList', (arr) => {
  userArea.innerHTML = '';

  arr.forEach(({
    nickname,
    id,
  }) => {
    const boolean = id === socket.id;
    printNickname(nickname, boolean);
  });
});

const fetchMessages = async () => {
  const response = await fetch('http://localhost:3000/messages');
  return response.json();
};

const getMessages = async () => {
  const messages = await fetchMessages();
  console.log(messages);

  messages.forEach((m) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = `${m.timestamp} - ${m.nickname}: ${m.message}`;
    messageDiv.setAttribute('data-testid', 'message');
    messageDiv.setAttribute('class', 'message');
    allMessages.append(messageDiv);
  });
};

window.onload = async () => {
  const nickname = Math.random()
    .toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);

  socket.emit('newLogin', nickname);

  await getMessages();
};