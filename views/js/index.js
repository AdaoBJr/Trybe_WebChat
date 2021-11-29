const socket = window.io();

function generateNick(length) {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

let nickname = generateNick(16);
let originalNickname = nickname;
const online = 'online-user';

const users = document.getElementById('users');
const userForm = document.getElementById('users-form');
const userInput = document.getElementById('user-input');

window.onbeforeunload = () => {
  socket.disconnect('this');
};

window.onload = () => {
  const user = document.createElement('li');

  user.textContent = nickname;
  user.dataset.testid = online;

  if (users.firstChild) {
    users.insertBefore(user, users.firstChild);
  } else {
    users.appendChild(user);
  }

  socket.emit('createUser', { originalNickname });
};

userForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (userInput.value) {
    originalNickname = nickname;
    nickname = userInput.value;

    const item = document.createElement('li');
    item.textContent = userInput.value;
    item.dataset.testid = online;

    users.removeChild(users.firstChild);
    users.insertBefore(item, users.firstChild);

    socket.emit('changeNickname', { originalNickname, nickname });
    userInput.value = '';
  }
});

const messages = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (messageInput.value) {
    socket.emit('message', { chatMessage: messageInput.value, nickname });
    messageInput.value = '';
  }
});

socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  item.dataset.testid = 'message';

  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('changeNickname', (usernames) => {
  const thisUser = document.createElement('li');
  thisUser.textContent = nickname;
  thisUser.dataset.testid = online;

  users.textContent = '';
  users.appendChild(thisUser);

  usernames.forEach((element) => {
    const item = document.createElement('li');
    
    item.textContent = element;
    item.dataset.testid = online;

    if (element !== nickname) users.appendChild(item);
  });
});