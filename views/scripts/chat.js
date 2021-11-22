const socket = window.io();

// gerar string aleatoria https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/

function geraStringAleatoria(tamanho) {
  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < tamanho; i += 1) {
      stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
}

// let nickname = geraStringAleatoria(16);

const messagesBox = document.querySelector('.messages');
const usersBox = document.querySelector('.usersOn');
const changeNick = document.querySelector('.nickname-box');
const nickButton = document.querySelector('.nickname-button');
const messageInput = document.querySelector('.message-box');
const messageButton = document.querySelector('.send-button');

let nickname = geraStringAleatoria(16);

const dataTest = 'data-testid';

// mudar nick
nickButton.addEventListener('click', (e) => {
  e.preventDefault();
  nickname = changeNick.value;
  socket.emit('changeNick', nickname);
  changeNick.value = '';
});

// enviar mensagem
messageButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('message', ({ chatMessage: messageInput.value, nickname }));
  messageInput.value = '';
});

// caixa de mensagens
const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  li.setAttribute(dataTest, 'message');
  messagesBox.appendChild(li);
};

socket.on('message', (message) => createMessage(message));
socket.on('usersList', (users) => {
  usersBox.innerHTML = '';
  const usersList = document.createElement('li');
  usersList.setAttribute(dataTest, 'online-user');
  usersList.innerText = nickname;
  usersBox.appendChild(usersList);
  users.forEach((user) => {
    if (user.nickname !== (nickname)) {
      const li = document.createElement('li');
      li.setAttribute(dataTest, 'online-user');
      li.innerText = user.nickname;
      usersBox.appendChild(li);
    }
  });
});

window.onbeforeunload = () => {
  socket.disconnect();
};
