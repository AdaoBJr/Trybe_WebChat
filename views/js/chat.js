const socket = window.io();

let nickname;

const createMessage = (message) => {
  const messagesUl = document.querySelector('#list-message');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
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
  const usersUl = document.querySelector('#list-nickname');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.innerText = user;
  usersUl.appendChild(li);
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
});

socket.on('message', (message) => createMessage(message));

socket.on('users', (users) => {
  const usersUl = document.querySelector('#list-nickname');

  document.querySelectorAll('.users').forEach((e) => {
    usersUl.removeChild(e);
  });

  createUser(nickname);
  users.forEach((user) => {
    if (user !== nickname) {
      createUser(user);
    }
  });
});