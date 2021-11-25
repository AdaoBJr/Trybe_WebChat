const socket = window.io();

let USERNAME = '';

const NICKNAMEBOX = document.querySelector('.nickname-box');
const ALL_USERS = document.querySelector('.all-users');
const MESSAGEBOX = document.querySelector('.message-box');

const inputNickname = (nickname) => {
  const allUsersLi = document.querySelectorAll('.all-users li');
  USERNAME = NICKNAMEBOX.value;

  if (allUsersLi.length) {
    ALL_USERS.innerHTML = '';
  }

  NICKNAMEBOX.value = '';

  socket.emit('users', nickname);
};

const nicknameGenerator = () => {
  let nickname = '';

  const lengthString = 16;
  const characteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < lengthString; index += 1) {
    nickname += characteres.charAt(
      Math.floor(Math.random() * characteres.length),
    );
  }

  USERNAME = nickname;

  socket.emit('users', nickname);
};

const renderUser = (user) => {
  ALL_USERS.insertAdjacentHTML(
    'beforeend',
    `<li data-testid="online-user">${user}</li>`,
  );
};

const renderMessage = (message) => {
  document
    .querySelector('.messages')
    .insertAdjacentHTML(
      'beforeend',
      `<div data-testid="message">${message}</div>`,
    );
};

window.onload = () => {
  nicknameGenerator();
};

socket.on('allMessages', (messages) => {
  for (let index = 0; index < messages.length; index += 1) {
    renderMessage(messages[index]);
  }
});

socket.on('message', (message) => {
  renderMessage(message);
});

socket.on('users', (users) => {
  ALL_USERS.innerHTML = '';

  users.forEach(({ nickname }) => {
    if (nickname) {
      renderUser(nickname);
    }
  });
});

document.getElementById('form-nickname').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = document.querySelector('.nickname-box').value;

  if (nickname.length) {
    inputNickname(nickname);
  }
});

document.getElementById('form-chat').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = USERNAME;
  let chatMessage = MESSAGEBOX.value;

  if (nickname.length && chatMessage.length) {
    const sendMessage = {
      chatMessage,
      nickname,
    };

    socket.emit('message', sendMessage);

    chatMessage = '';
  }
});
