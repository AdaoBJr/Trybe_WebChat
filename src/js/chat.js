const socket = window.io();

window.onload = () => {
  // cria nome randomico com 16 caracteres:
  const newUser = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);
  sessionStorage.setItem('@user', JSON.stringify(newUser));

  socket.emit('userOnline', newUser);
};

const messageBtn = document.querySelector('#send-msg-btn');
const nicknameBtn = document.querySelector('#save-nick-btn');
const inputMessage = document.querySelector('#messageInput');
const inputNickname = document.querySelector('#nickname-input');

nicknameBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const user = document.querySelector('#nickname');
  user.innerText = inputNickname.value;

  sessionStorage.setItem('@user', JSON.stringify(inputNickname.value));

  socket.emit('updateNickname', inputNickname.value);

  inputNickname.value = '';
});

messageBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const randomNickname = JSON.parse(sessionStorage.getItem('@user'));

  const payload = {
    chatMessage: inputMessage.value,
    nickname: randomNickname,
  };

  socket.emit('message', payload);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute('data-testid', 'message');
  messagesUl.appendChild(li);
};

socket.on('userOnline', (users) => {
  const onlineUsers = document.querySelector('#online-users');
  onlineUsers.innerText = '';

  users.forEach(([nickname, socketId]) => {
    const li = document.createElement('li');

    li.innerText = nickname;
    li.setAttribute('data-testid', 'online-user');

    if (socketId === socket.id) {
      onlineUsers.prepend(li);
    } else {
      onlineUsers.appendChild(li);
    }
  });
});

socket.on('message', (message) => createMessage(message));
