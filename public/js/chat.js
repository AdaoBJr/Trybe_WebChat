/* eslint-disable max-lines-per-function */
const socket = window.io();
const testId = 'data-testid';

const messageForm = document.querySelector('#form2');
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newUserMessage = document.querySelector('#message-box');
  const message = { chatMessage: newUserMessage.value };
  socket.emit('message', message);
  newUserMessage.value = '';
  return false;
});

const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newNickname = document.querySelector('#nickname-box').value;
  socket.emit('setUserName', newNickname);
  sessionStorage.setItem('nickname', newNickname);
  return false;
});

const setMessage = (message) => {
  const messageBox = document.querySelector('#messageBox');
  const li = document.createElement('li');
  li.innerHTML = message;
  li.setAttribute(testId, 'message');
  messageBox.appendChild(li);
};

const showLoggedUsers = (users) => {
  const currentUser = sessionStorage.getItem('nickname');
  const usersToArray = Object.values(users).reverse();
  usersToArray.splice(usersToArray.indexOf(currentUser), 1);
  usersToArray.unshift(currentUser);
  console.log(usersToArray);
  const userList = document.querySelector('#loggedUsersList');
  userList.innerHTML = '';
  usersToArray.forEach((user) => {
    const li = document.createElement('li');
    li.setAttribute(testId, 'online-user');
    li.innerHTML = user;
    userList.appendChild(li);
  });
};

const setData = ({ nickname }) => {
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
