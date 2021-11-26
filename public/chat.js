const socket = window.io();

const form = document.querySelector('#chat');
const dataTestid = 'data-testid';
const inputRandomNick = '.randomNickname';
let nickname = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const inputMessage = document.querySelector('.chatMessage').value;
  const inputRandomNickname = document.querySelector(inputRandomNick).innerText;

  if (inputMessage.length) {
    const sendMessage = {
      nickname: inputRandomNickname,
      chatMessage: inputMessage,
    };
    
    socket.emit('message', sendMessage);
  }
});

// salva nickname
const buttonSaveNickname = document.querySelector('.saveNickname');
buttonSaveNickname.addEventListener('click', (event) => {
  event.preventDefault();

  const newNickname = document.querySelector('.nickname').value;
  const liOnlineUsers = document.querySelector('.online');
  nickname = newNickname;
  liOnlineUsers.innerHTML = newNickname;
  console.log('novo nickname', newNickname);
  socket.emit('updateNickname', nickname);
});

// lista usuários online
const createListUsersOnline = (nickname, id) => {
  console.log('nickname no chat.js', nickname);
  const ulUsers = document.querySelector('.users');
  const createLi = document.createElement('li');
  createLi.setAttribute(dataTestid, 'oline-user');
  createLi.setAttribute('class', 'online');
  createLi.setAttribute('id', id);
  createLi.innerHTML = nickname;
  ulUsers.appendChild(createLi);
};
socket.on('usersOnline', ({ nickname, id }) => createListUsersOnline(nickname, id));

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  // https://pt.stackoverflow.com/questions/56766/adicionar-atributo-a-um-elemento
  li.setAttribute(dataTestid, 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const updateNickname = (nickName, id) => {
  const listOnlineUsers = document.getElementById(id);
  listOnlineUsers.innerHTML = nickName;
};

const offUsers = (id) => {
  const ulUsers = document.querySelector('.users');
  const listOnlineUsers = document.getElementById(id);
  ulUsers.removeChild(listOnlineUsers);
};

socket.on('message', (message) => createMessage(message));
socket.on('updateNickname', ({ nickName, id }) => updateNickname(nickName, id));
socket.on('disconnectUser', (id) => offUsers(id));
