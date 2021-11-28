const socket = window.io();

let userName = '';

const nickNameInput = document.querySelector('.nickname-box');
const allUsersList = document.querySelector('.all-users');
const messageInput = document.querySelector('.message-box');

const addNickname = (nickname) => {
  const allUsersLi = document.querySelectorAll('.all-users li');

  userName = nickNameInput.value;

  if (allUsersLi.length) {
    allUsersList.innerHTML = '';
  }

  nickNameInput.value = '';

  socket.emit('users', nickname);
};

const generateNickname = () => {
  let nickname = '';

  const stringLength = 16;

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let index = 0; index < stringLength; index += 1) {
    nickname += chars.charAt(

      Math.floor(Math.random() * chars.length),

    );
  }

  userName = nickname;

  socket.emit('users', nickname);
};

const userRender = (user) => {
  allUsersList.insertAdjacentHTML(
    'beforeend',
    `<li data-testid="online-user">${user}</li>`,
  );
};

const messageRender = (message) => {
  document
    .querySelector('.messages')
    .insertAdjacentHTML(
      'beforeend',
      `<div data-testid="message">${message}</div>`,
    );
};

window.onload = () => {
  generateNickname();
};

socket.on('allMessages', (messages) => {
  for (let index = 0; index < messages.length; index += 1) {
    messageRender(messages[index]);
  }
});

socket.on('message', (message) => {
  messageRender(message);
});

socket.on('users', (users) => {
  allUsersList.innerHTML = '';

  users.forEach(({ nickname }) => {
    if (nickname) {
      userRender(nickname);
    }
  });
});

document.getElementById('nickname-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = document.querySelector('.nickname-box').value;

  if (nickname.length) {
    addNickname(nickname);
  }
});

document.getElementById('form-chat').addEventListener('submit', (event) => {
  event.preventDefault();

  const nickname = userName;
  let chatMessage = messageInput.value;

  if (nickname.length && chatMessage.length) {
    const sendMessage = {
      chatMessage,
      nickname,
    };

    socket.emit('message', sendMessage);

    chatMessage = '';
  }
});