const client = window.io();

const form = document.querySelector('#form-message');
const textBox = document.querySelector('#input-text');
let nickname = Math.random().toString().substr(2, 16);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const chatMessage = textBox.value;
    client.emit('message', { nickname, chatMessage });
    textBox.value = '';
    return false;
  });

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

const createUsersList = (users) => {
  const usersUl = document.querySelector('#users-online');
  usersUl.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerText = user.nickname;
    usersUl.appendChild(li);
  });
};

  const nickNameForm = document.querySelector('#form-nickname');
  const nicknameInput = document.querySelector('#input-nickname');

  nickNameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const changedNickname = nicknameInput.value;
    nickname = changedNickname;
    client.emit('changeNickname', changedNickname);
    nicknameInput.value = '';
    return false;
  });

client.emit('newUserOnline', nickname);
client.on('message', (message) => createMessage(message));
client.on('newUser', (message) => createMessage(message));
client.on('usersList', (users) => createUsersList(users));