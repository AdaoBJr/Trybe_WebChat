const socket = window.io();
let nickname = Math.random().toString(16)
.substring(2, 10) + Math.random().toString(16).substring(2, 10);
  const msgHistory = document.getElementById('msgHistory');
  const inputMessage = document.getElementById('message');
  const sendBtn = document.getElementById('sendBtn');
  const user = document.getElementById('user');
  const datatestid = 'data-testid';
  const inputNickname = document.getElementById('nick');
  const alterNickBtn = document.getElementById('alterNick');
  user.innerText = nickname;

sendBtn.addEventListener('click', (e) => {
e.preventDefault();
let chatMessage = inputMessage.value;
if (chatMessage) {
  socket.emit('message', { chatMessage, nickname });
  chatMessage = '';
}
});

socket.on('message', (msg) => {
  const msgItem = document.createElement('li');
  msgItem.setAttribute(datatestid, 'message');
  msgItem.innerText = msg;
  msgHistory.appendChild(msgItem);
});

socket.emit('userOnline', { nickname });

socket.on('userOnline', (userList) => {
  user.innerHTML = '';
  userList.forEach(({ nickname: nick, id }) => {
    const userItem = document.createElement('li');
    userItem.setAttribute(datatestid, 'online-user');
    userItem.innerText = nick;
    if (id === socket.id) {
      user.prepend(userItem);
    } else { user.appendChild(userItem); }
  });
});

socket.on('allMessage', (msgList) => {
  msgList.forEach(({ timestamp, message, nickname: nick }) => {
    const item = document.createElement('li');
    item.setAttribute(datatestid, 'message');
    item.innerText = `${timestamp} - ${nick} ${message}`;
    msgHistory.appendChild(item);
  });
});

alterNickBtn.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = inputNickname.value;
  user.innerText = nickname;
  inputNickname.value = '';
  socket.emit('userOnline', { nickname });
  });