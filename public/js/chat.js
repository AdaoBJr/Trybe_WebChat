const socket = window.io();

const ulMessages = document.querySelector('#list-message');
const ulUsers = document.querySelector('#list-nickname');

let nickname;

const createMessage = (message) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  ulMessages.appendChild(li);
};

const btnMessage = document.querySelector('#btn-message');

btnMessage.addEventListener('click', (e) => {
  e.preventDefault();
  const message = document.querySelector('#input-message');
  socket.emit('message', { chatMessage: message.value, nickname });
  message.value = '';
  return false;
});

const createUser = (user) => {
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.className = 'users';
  li.innerText = user;
  ulUsers.appendChild(li);
};

const btnNickname = document.querySelector('#btn-nickname');

btnNickname.addEventListener('click', (e) => {
  e.preventDefault();
  const user = document.querySelector('#input-nickname');
  nickname = user.value;
  socket.emit('nickname', user.value);
  user.value = '';
  return false;
});

socket.on('newConnection', ({ user, historic }) => {
  historic.forEach((message) => createMessage(message));
  nickname = user;
  socket.emit('nickname', user);
  return false;
});

socket.on('message', (message) => createMessage(message));

socket.on('users', (users) => {
  document.querySelectorAll('.users').forEach((e) => {
    ulUsers.removeChild(e);
  });

  createUser(nickname);
  users.forEach((user) => {
    if (user !== nickname) {
      createUser(user);
    }
  });
});