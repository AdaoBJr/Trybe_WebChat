const socket = window.io();

const ENDPOINT = 'http://localhost:3000/messages';
const DATA_TESTID = 'data-testid';

const fetchAPI = async () => {
  const response = await fetch(ENDPOINT);
  return response.json();
};

const renderMessages = (messageList) => {
  const messagesUl = document.querySelector('#messages');
  messageList.forEach((el) => {
    console.log(el);
    const li = document.createElement('li');
    li.innerText = `${el.timestamp} - ${el.nickname}: ${el.message}`;
    li.setAttribute(DATA_TESTID, 'message');
    messagesUl.appendChild(li);
  });
};

window.onload = async () => {
  const newUser = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);
  sessionStorage.setItem('@user', JSON.stringify(newUser));

  socket.emit('userOnline', newUser);

  const messages = await fetchAPI();
  renderMessages(messages);
};

const messageBtn = document.querySelector('#send-msg-btn');
const nicknameBtn = document.querySelector('#save-nick-btn');
const inputMessage = document.querySelector('#messageInput');
const inputNickname = document.querySelector('#nickname-input');

nicknameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.setItem('@user', JSON.stringify(inputNickname.value));

  socket.emit('updateNickname', inputNickname.value);

  inputNickname.value = '';
});

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const randomNickname = JSON.parse(sessionStorage.getItem('@user'));

  const payload = {
    chatMessage: inputMessage.value,
    nickname: randomNickname,
  };
  
  socket.emit('message', payload);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(DATA_TESTID, 'message');
  messagesUl.appendChild(li);
};

socket.on('userOnline', (users) => {
  const onlineUsers = document.querySelector('#online-users');
  onlineUsers.innerText = '';

  users.forEach(([nickname, socketId]) => {
    const li = document.createElement('li');

    li.innerText = nickname;
    li.setAttribute(DATA_TESTID, 'online-user');
    
    if (socketId === socket.id) {
      onlineUsers.prepend(li);
    } else {
      onlineUsers.appendChild(li);
    }
  });
});

socket.on('message', (message) => createMessage(message));
