const socket = window.io();

let userId = '';
const DATA_TESTID = 'data-testid';

const nickNameInput = document.getElementById('nickname_input');
const nickNameBtn = document.getElementById('nickname_btn');
const messageInput = document.getElementById('messages_input');
const messageBtn = document.getElementById('messages_btn');

messageBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const nickname = userId || socket.id.slice(0, 16);
  socket.emit('message', {
    chatMessage: messageInput.value,
    nickname });
    messageInput.value = '';
  });

const sendMessage = (message) => {
  const messageDiv = document.getElementById('messagesUsers');
  const messageElement = document.createElement('li');
  messageElement.innerText = message;
  messageElement.setAttribute(DATA_TESTID, 'message');
  messageDiv.appendChild(messageElement);
};

nickNameBtn.addEventListener('click', (event) => {
  event.preventDefault();
  userId = nickNameInput.value;
  if (userId !== '') {
  socket.emit('newNickname', userId);
  nickNameInput.value = '';
  }
});

const users = (usersOnline) => {
  const loadNickName = socket.id.slice(0, 16);
  const usersSection = document.getElementById('usersOn');
  usersSection.innerHTML = '';

  usersOnline.forEach((user) => {
    const userElement = document.createElement('li');
    userElement.innerText = user;
    userElement.setAttribute(DATA_TESTID, 'online-user');
    usersSection.appendChild(userElement);
    if (user === userId || user === loadNickName) {
      return usersSection.prepend(userElement);
    }
    return usersSection.appendChild(userElement);
  });
};

const messagesDataBase = (messages) => {
  messages.forEach(({ dateNow, nickname, chatMessage }) => {
    const messagesSection = document.getElementById('messagesUsers');
    const messageElement = document.createElement('li');
    messageElement.innerText = `${dateNow} - ${nickname}: ${chatMessage}`;
    messageElement.setAttribute(DATA_TESTID, 'message');
    messagesSection.appendChild(messageElement);
  });
};

socket.on('chatHistory', (messages) => {
  messagesDataBase(messages);
});

socket.on('message', (message) => {
  sendMessage(message);
});

socket.on('users', (usersOnline) => {
  users(usersOnline);
});
