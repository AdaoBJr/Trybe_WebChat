const socket = window.io();

const messageText = document.getElementById('message-field');
const btnSend = document.getElementById('send-button');
const nicknameField = document.getElementById('nickname-field');
const btnSendNickname = document.getElementById('send-nickname-button');
const listOnlineUser = document.getElementById('online-users');
const messageBox = document.getElementById('message');
let newNickname = '';

const dataTestId = 'data-testid';

const chatMessage = (message) => {
  const div = document.createElement('div');
  div.setAttribute(dataTestId, 'message');
  div.classList.add('message');
  div.innerHTML = `${message}`;
  messageBox.appendChild(div);
};

socket.on('message', (message) => {
  console.log(message);
  chatMessage(message);
});

socket.on('listedUsers', (users) => {
  listOnlineUser.innerHTML = '';
  const newDiv = document.createElement('div');
  newDiv.setAttribute(dataTestId, 'online-user');
  newDiv.innerText = newNickname || socket.id.slice(0, 16);
  listOnlineUser.appendChild(newDiv);
  users.forEach((elem) => {
    if (elem.nickname !== (newNickname || socket.id.slice(0, 16))) {
      const newDiv2 = document.createElement('div');
      newDiv2.setAttribute(dataTestId, 'online-user');
      newDiv2.innerText = elem.nickname;
      listOnlineUser.appendChild(newDiv2);
    }
  });
});

const changeNickname = () => {
  newNickname = nicknameField.value;
  console.log(newNickname);
  socket.emit('changedNickname', newNickname);
  nicknameField.value = '';
};

nicknameField.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    changeNickname();
  }
});

btnSendNickname.addEventListener('click', () => {
  changeNickname();
});

const sendMsg = () => {
  const msg = messageText.value;
  const nickname = newNickname || socket.id.slice(0, 16);
  socket.emit('message', ({ chatMessage: msg, nickname }));
  messageText.value = '';
};

messageText.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMsg();
  }
});

btnSend.addEventListener('click', () => {
  sendMsg();
});

window.onbeforeunload = () => {
  socket.disconnect();
};