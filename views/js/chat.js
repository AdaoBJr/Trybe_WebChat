window.onload = () => {};
const socket = window.io();

window.onbeforeunload = () => { 
  socket.disconnect(); 
};

const nickNameRandom = Math.random().toString(36).substring(2, 10)
+ Math.random().toString(36).substring(2, 10);

const DATA_TEST_ID = 'data-testid';

const messageForm = document.querySelector('#message-form');
const inputMessage = document.querySelector('#message-box');
const inputNickname = document.querySelector('#nickname-box');
const nicknameForm = document.querySelector('#nickname-form');
const randomCaracteres = nickNameRandom;
  
  function setNickname() {
    const newNickName = randomCaracteres;
    sessionStorage.setItem('NickName', newNickName);
  }

  nicknameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sessionStorage.setItem('NickName', inputNickname.value);
    socket.emit('updateNickname', inputNickname.value);
    inputNickname.value = '';
    return false;
  });

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nickname = sessionStorage.getItem('NickName');  
  socket.emit('message', { chatMessage: inputMessage.value, nickname });
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => {
  createMessage(message);
});

socket.on('messageList', (messageList) => {
  messageList.map((message) => createMessage(message));
});

  const renderOnlineUsers = (onlineUsers) => {
    const onlineUsersUl = document.querySelector('#online-users-list');
    onlineUsersUl.innerHTML = '';
    const userNickName = sessionStorage.getItem('NickName');
    const userNickNameLi = document.createElement('li');
    userNickNameLi.setAttribute(DATA_TEST_ID, 'online-user');
    userNickNameLi.innerText = userNickName;
    onlineUsersUl.appendChild(userNickNameLi);
    const onlineUsersNickNames = onlineUsers.map((userObj) => userObj.nickname);
    onlineUsersNickNames.forEach((user) => {
      if (user !== userNickName) {
        const userLi = document.createElement('li');
        userLi.setAttribute(DATA_TEST_ID, 'online-user');
        userLi.innerText = user;
        onlineUsersUl.appendChild(userLi);
      }
    });
  };

  socket.on('onlineUsers', (onlineUsers) => {
    renderOnlineUsers(onlineUsers);
});

socket.on('connect', () => {
  setNickname();
  const nickname = sessionStorage.getItem('NickName');
  socket.emit('newUser', nickname);
});