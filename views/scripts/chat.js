const socket = window.io();

let nickname = '';

if (!sessionStorage.getItem('nickname')) {
  // Source: Ajuda do Anderson Pedrosa - T10 - TB
  nickname = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);  
} else {
  nickname = sessionStorage.getItem('nickname');
}

socket.emit('joinChat', { nickname });

// Source: https://developer.mozilla.org/pt-BR/docs/Web/API/Window/sessionStorage
sessionStorage.setItem('nickname', nickname);

const inputNicknameForm = document.querySelector('#inputNicknameForm');
const inputMessageForm = document.querySelector('#inputMessageForm');
const inputMessage = document.querySelector('#inputMessage');
const inputNickname = document.querySelector('#inputNickname');
const nicknameLabel = document.querySelector('#nicknameLabel');

nicknameLabel.innerText = nickname;

inputNicknameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  nicknameLabel.innerText = inputNickname.value;
  sessionStorage.setItem('nickname', inputNickname.value);
  nickname = inputNickname.value;
  socket.emit('userNameUpdate', inputNickname.value);
  inputNickname.value = '';
  return false;
});

inputMessageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Source: https://developer.mozilla.org/pt-BR/docs/Web/API/Window/sessionStorage
  nickname = sessionStorage.getItem('nickname');
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

const onlineUsersListUpdate = (onlineUsersObject) => {
  console.log(onlineUsersObject);

  const usersUL = document.querySelector('#onlineUsers');
  const usersLI = document.querySelectorAll('.others-online-users');

  if (usersLI.length !== 0) usersLI.forEach((li) => li.remove());

  console.log(nickname);

  const updatedUsersList = Object.values(onlineUsersObject)
    .filter((onlineUserNickname, _index, _array) => onlineUserNickname !== nickname);

  updatedUsersList.forEach((onlineUserNickname, _index, _array) => {
      const li = document.createElement('li');
      li.setAttribute('data-testid', 'online-user');
      li.setAttribute('class', 'others-online-users');
      li.innerText = onlineUserNickname;
      usersUL.appendChild(li);
  });
};

socket.on('message', (message) => createMessage(message));

socket.on('onlineUser', (onlineUsersList) => onlineUsersListUpdate(onlineUsersList));

window.onbeforeunload = () => {
  socket.disconnect();
};
