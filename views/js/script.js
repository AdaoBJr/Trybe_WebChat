/* Tive ajuda na realização da estruturação desse projeto através do site
https://tsh.io/blog/socket-io-tutorial-real-time-communication/
 */

const socket = window.io();

let userName = '';

const formNickname = document.querySelector('#form_nickname');
const inboxPeople = document.querySelector('#nickname');
const inputField = document.querySelector('#messageInput');
const inputNick = document.querySelector('#nicknameInput');
const messageForm = document.querySelector('#form');
const messageBox = document.querySelector('#mensagens');

const randomUser = Math.random().toString(16)
.substr(2, 8) + Math.random().toString(16).substr(2, 8);

// Peguei no site https://www.horadecodar.com.br
function changePosition(arr, from, to) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}

const addToUsersBox = (userNick) => {
  if (document.getElementById(`${userNick}`)) {
    return;
  }

  sessionStorage.setItem('nickname', userName); 
  const userBox = document.createElement('li');
  userBox.setAttribute('data-testid', 'online-user');
  userBox.setAttribute('id', `${userNick}`);
  userBox.innerText = userNick;
  inboxPeople.appendChild(userBox);
};

const newUserConnected = (user) => {
  userName = user || `${randomUser}`;
  socket.emit('new user', userName);
  addToUsersBox(userName);
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
  const userExisting = data.findIndex((element) => element.data === userName);
  if (userExisting === -1) { console.log('Palmeiras não tem mundial'); }
  const newArryData = changePosition(data, userExisting, 0);
  newArryData.forEach((user) => addToUsersBox(user.data));
  data.forEach((user) => addToUsersBox(user.data));
});

// Tive ajuda de Lucas Lotar
socket.on('changeUser', (data) => {
  inboxPeople.textContent = '';
  const userExisting = data.findIndex((element) => element.data === userName);
  if (userExisting === -1) { console.log('Palmeiras não tem mundial'); }
  const newArryData = changePosition(data, userExisting, 0);

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

// Tive ajuda de Renan Braga
socket.on('allMessage', (msgList) => {
  msgList.forEach(({ timestamp, message, nickname: nick }) => {
    const item = document.createElement('li');
    item.setAttribute('data-testid', 'message');
    item.innerText = `${timestamp} - ${nick} ${message}`;
    messageBox.appendChild(item);
  });
});