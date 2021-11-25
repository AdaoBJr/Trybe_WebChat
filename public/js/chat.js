const socket = window.io();
const nickNameButtonName = '#showUserNickName';
const sendMessageButton = document.querySelector('#newMessage');
const saveNickButton = document.querySelector('#saveNick');
  
sendMessageButton.addEventListener('click', () => {
  const nickname = document.querySelector(nickNameButtonName).innerHTML;
  const newUserMessage = document.querySelector('#newUserMessage');
  const message = { chatMessage: newUserMessage.value, nickname };
  socket.emit('message', message);
  newUserMessage.value = '';
  return false;
});

saveNickButton.addEventListener('click', () => {
  const newNickname = document.querySelector('#userName').value;
  const nickNameBox = document.querySelector(nickNameButtonName);
  sessionStorage.setItem('nickname', newNickname);
  nickNameBox.innerHTML = newNickname;
});

const setMessage = (message) => {
  const messageBox = document.querySelector('#messageBox');
  const li = document.createElement('li');
  li.innerHTML = message;
  messageBox.appendChild(li);
};

const firstLoad = ({ chatMessages, newNickname }) => {
    const setNickName = document.querySelector(nickNameButtonName);
    const userNickName = sessionStorage.getItem('nickname');
    if (!userNickName) {
      const nick16 = newNickname.slice(0, 16);
      setNickName.innerHTML = nick16;
      sessionStorage.setItem('nickname', nick16);
    } else {
      setNickName.innerHTML = userNickName;
    }
    const messageBox = document.querySelector('#messageBox');
    chatMessages.forEach((e) => {
      const { timestamp, nickname, message } = e;
      const newMessage = `${timestamp} - ${nickname}: ${message}`;
      const li = document.createElement('li');
      li.setAttribute('data-testid', 'message');
      li.innerHTML = newMessage;
      messageBox.appendChild(li);
    });
};

socket.on('message', (message) => setMessage(message));
socket.on('connected', ({ chatMessages, newNickname }) => firstLoad({ chatMessages, newNickname }));
