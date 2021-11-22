/* eslint-disable sonarjs/no-duplicate-string */
const socket = window.io();

const form = document.querySelector('#chat');
const dataTestid = 'data-testid';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const inputMessage = document.querySelector('.chatMessage').value;
  const inputRandomNickname = document.querySelector('.randomNickname').innerText;

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
  socket.emit('nick', newNickname);
  const inputRandomNickname = document.querySelector('.randomNickname');
  inputRandomNickname.innerText = newNickname;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  // https://pt.stackoverflow.com/questions/56766/adicionar-atributo-a-um-elemento
  li.setAttribute(dataTestid, 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUser = (message) => {
  const usuario = document.querySelector('.randomNickname');
  usuario.innerHTML = message;
  const usuarioOnline = document.querySelector('.online');
  const createList = document.createElement('li');
  createList.setAttribute(dataTestid, 'online-user');
  createList.innerHTML = message;
  usuarioOnline.appendChild(createList);
};

const updateNickname = (message) => {
  const usuario = document.querySelector('.randomNickname'); 
  if (message === usuario) usuario.remove();
  const onlineUsersUl = document.querySelector('.online');
  const createList = document.createElement('li');
  createList.setAttribute(dataTestid, 'online-user');
  createList.innerText = message;
  onlineUsersUl.appendChild(createList);
};

socket.on('message', (message) => createMessage(message));
socket.on('login', (message) => createUser(message));
socket.on('newNick', (usuario) => updateNickname(usuario));
socket.on('newLogin', ({ usuario }) => updateNickname(usuario));
