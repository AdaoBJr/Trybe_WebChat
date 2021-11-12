const socket = window.io();
/* const orderUsers = require('./utils/orderUsers'); */

let userName = '';

const formNickname = document.querySelector('#form_nickname');
const inboxPeople = document.querySelector('#nickname');
const inputField = document.querySelector('#messageInput');
const inputNick = document.querySelector('#nicknameInput');
const messageForm = document.querySelector('#form');
const messageBox = document.querySelector('#mensagens');

const randomUser = Math.random().toString(16)
.substr(2, 8) + Math.random().toString(16).substr(2, 8);

function changePosition(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}

const addToUsersBox = (userNick) => {
  if (document.getElementById(`${userNick}`)) {
    return;
  }
  sessionStorage.setItem('nickname', userName); 
  const userBox = `<li data-testid="online-user" id=${userNick}>${userNick}</li>`;
  
  inboxPeople.innerHTML += userBox;
};

const newUserConnected = (user) => {
  userName = user || `${randomUser}`;
  socket.emit('new user', userName);
  return addToUsersBox(userName);
};

// new user is created so we generate nickname and emit event
newUserConnected();

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  const oldNickname = userName;
  userName = inputNick.value;
  inputNick.value = '';
  socket.emit('changeUser', { oldNickname, newNickname: userName });
  return false;
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }
  socket.emit('message', { chatMessage: inputField.value, nickname: userName });
  inputField.value = '';
});

const addNewMessage = (data) => {
  const receivedMsg = `<li data-testid="message">${data}</li>`;
  const myMsg = `<li data-testid="message">${data}</li>`;
  messageBox.innerHTML += data === userName ? myMsg : receivedMsg;
};

socket.on('new user', (data) => {
  inboxPeople.textContent = '';
  const userExist = data.findIndex((element) => element.data === userName);
  if (userExist === -1) { console.log('Palmeiras não tem mundial'); }
  const newArryData = changePosition(data, userExist, 0);
  newArryData.forEach((user) => addToUsersBox(user.data));
  data.forEach((user) => addToUsersBox(user.data));
});

socket.on('changeUser', (data) => {
  inboxPeople.textContent = '';

  const userExist = data.findIndex((element) => element.data === userName);
  if (userExist === -1) { console.log('Palmeiras não tem mundial'); }
  const newArryData = changePosition(data, userExist, 0);

  newArryData.forEach((user) => {
    console.log(user);
    addToUsersBox(user.data);
  });
});

socket.on('user discon', ({ data }) => {
  document.getElementById(`${data}`).remove();
});

socket.on('message', (message) => {
  addNewMessage(message);
});

socket.on('allMessage', (msgList) => {
  msgList.forEach(({ timestamp, message, nickname: nick }) => {
    const item = document.createElement('li');
    item.setAttribute('data-testid', 'message');
    item.innerText = `${timestamp} - ${nick} ${message}`;
    messageBox.appendChild(item);
  });
});