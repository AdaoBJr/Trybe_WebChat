const socket = window.io();

let nickname = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);

socket.emit('userConnected', nickname);

const dataTestId = 'data-testid';

const getElement = (id, testid) => {
  const element = document.querySelector(`#${id}`);
  if (testid) {
    element.setAttribute(dataTestId, testid);
  }
  return element;
};
const messageInput = getElement('message-input', 'message-box');
const chatMessages = getElement('chat');
const sendMessage = getElement('send-message', 'send-button');
const nicknameInput = getElement('nickname-input', 'nickname-box');
const changeNickname = getElement('change-nickname', 'nickname-button');
const onlineUsers = getElement('online-users');

sendMessage.addEventListener('click', (event) => {
  event.preventDefault();
  const chatMessage = messageInput.value;
  socket.emit('message', { nickname, chatMessage });
  messageInput.value = '';
});

const newMessage = (text) => {
  const message = document.createElement('li');
  message.setAttribute(dataTestId, 'message');
  message.innerText = text;
  chatMessages.appendChild(message);
};

socket.on('updateUsers', (users) => {
  onlineUsers.innerHTML = '';
  users.forEach((user) => {
    const newUser = document.createElement('li');
    newUser.setAttribute(dataTestId, 'online-user');
    newUser.innerText = user.nickname;
      if (socket.id === user.id) {
        onlineUsers.prepend(newUser);
      } else {
        onlineUsers.appendChild(newUser);
      }
  });
});

changeNickname.addEventListener('click', (event) => {
  event.preventDefault();
  const lastNickname = nickname;
  nickname = nicknameInput.value;
  nicknameInput.value = '';
  socket.emit('changeNickname', { nickname, lastNickname });
});

socket.on('message', (text) => newMessage(text));
