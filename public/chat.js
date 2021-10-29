const socket = window.io();

const form = document.querySelector('#chat');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const inputMessage = document.querySelector('.chatMessage').value;
  const inputNickname = document.querySelector('.nickname').value;

  if (inputMessage.length) {
    const sendMessage = {
      nickname: inputNickname,
      chatMessage: inputMessage,
    };
    socket.emit('message', sendMessage);
  }

  const createMessage = (message) => {
    const messagesUl = document.querySelector('.messages');
    const li = document.createElement('li');
    // https://pt.stackoverflow.com/questions/56766/adicionar-atributo-a-um-elemento
    li.setAttribute('data-testid', 'message');
    li.innerText = message;
    messagesUl.appendChild(li);
  };

  socket.on('message', (message) => createMessage(message));
});

// https://www.youtube.com/watch?v=Hr5pAAIXjkA&ab_channel=DevPleno
const randomString = (length) => {
  let nickname;
  do {
    nickname += Math.random().toString(36).substr(2);
  } while (nickname.length < length);
  nickname = nickname.substr(0, length);
  return nickname;
};

const inputRandomNickname = document.querySelector('.randomNickname');
const stringNickname = randomString(16);
inputRandomNickname.innerHTML = stringNickname;

const buttonSave = document.querySelector('.saveNickname');
buttonSave.addEventListener('click', () => {
  const inputNickname = document.querySelector('.nickname').value;
  console.log(inputNickname);
  // https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
  sessionStorage.setItem('nickname', inputNickname);
});