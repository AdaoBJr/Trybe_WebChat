const socket = window.io();

const form = document.querySelector('#chat');

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

const createMessage = (message) => {
  const messagesUl = document.querySelector('.messages');
  const li = document.createElement('li');
  // https://pt.stackoverflow.com/questions/56766/adicionar-atributo-a-um-elemento
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('receivedMessage', (message) => createMessage(message));



const inputRandomNickname = document.querySelector('.randomNickname');
const stringNickname = randomString(16);
inputRandomNickname.innerHTML = stringNickname;

// salva nickname
const buttonSaveNickname = document.querySelector('.saveNickname');
buttonSaveNickname.addEventListener('click', (event) => {
  event.preventDefault();

  const newNickname = document.querySelector('.nickname').value;
  const message = document.querySelector('.message-saveNickname');
  message.innerHTML = 'Nickname Salvo';
  inputRandomNickname.innerHTML = newNickname;

  socket.emit('newNickname', newNickname);
});

// cria lista usuários online
const onlineUserList = (listOnline) => {
  const ulList = document.querySelector('.online');
  ulList.innerHTML = '';
  listOnline.forEach((user) => {
    const createList = document.createElement('li');
    createList.setAttribute('data-testid', 'online-user');
    createList.innerHTML = user;
    ulList.appendChild(createList);
  });
};

socket.on('onlineUsers', (list) => onlineUserList(list));
