/* eslint-disable max-lines-per-function */
const socket = window.io();
const nickNameButtonName = '#showUserNickName';
const sendMessageButton = document.querySelector('#newMessage');
const saveNickButton = document.querySelector('#saveNick');
const testId = 'data-testid';

sendMessageButton.addEventListener('click', () => {
  const nickname = document.querySelector(nickNameButtonName).innerHTML;
  const newUserMessage = document.querySelector('#newUserMessage');
  const message = { chatMessage: newUserMessage.value, nickname };
  socket.emit('message', message);
  newUserMessage.value = '';
  return false;
});

saveNickButton.addEventListener('click', () => {
  const newNickname = document.querySelector('#userName').value;
  const nickNameBox = document.querySelector(nickNameButtonName);
  sessionStorage.setItem('nickname', newNickname);
  nickNameBox.innerHTML = newNickname;
  socket.emit('setUserName', newNickname);
});

const setMessage = (message) => {
  const messageBox = document.querySelector('#messageBox');
  const li = document.createElement('li');
  li.innerHTML = message;
  li.setAttribute(testId, 'message');
  messageBox.appendChild(li);
};

const showLoggedUsers = (users) => {
  const userList = document.querySelector('#loggedUsersList');
  userList.innerHTML = '';
  Object.values(users).reverse().forEach((user) => {
    console.log(user);
    const li = document.createElement('li');
    li.setAttribute(testId, 'online-user');
    li.innerHTML = user;
    userList.appendChild(li);
  });
};

const setData = ({ nickname }) => {
    const setNickName = document.querySelector(nickNameButtonName);
    setNickName.innerHTML = nickname;
    sessionStorage.setItem('nickname', nickname);
};

const loadData = (chatMessages) => {
  const messageBox = document.querySelector('#messageBox');
  if (chatMessages) {
    chatMessages.forEach((e) => {
      const { timestamp, nickname, message } = e;
      const newMessage = `${timestamp} - ${nickname}: ${message}`;
      const li = document.createElement('li');
      li.setAttribute(testId, 'message');
      li.innerHTML = newMessage;
      messageBox.appendChild(li);
    });
  }

  const userName = sessionStorage.getItem('nickname');
  socket.emit('setUserName', userName);
};

socket.on('connected', (chatMessages) => loadData(chatMessages));
socket.on('thisIsYourData', ({ nickname }) => setData({ nickname }));
socket.on('updateUserList', (users) => showLoggedUsers(users));
socket.on('message', (message) => setMessage(message));
// socket.on('thisIsYourData', ({ chatMessages, newNickname }) => firstLoad({ 
//   chatMessages, newNickname }));
