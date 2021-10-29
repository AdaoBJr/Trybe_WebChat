const socket = io();
const message = document.querySelector('#message');
const messageBtnSend = document.querySelector('#msg-submit');
const nicknameForm = document.querySelector('#nick-form');
const date = new Date();

const ramdomName = () => {
  // função para criar o ramdomName https://www.webtutorial.com.br/funcao-para-gerar-uma-string-aleatoria-random-com-caracteres-especificos-em-javascript/#:~:text=A%20l%C3%B3gica%20para%20gerar%20cada,que%201%20(Exemplo%3A%200.35467963577180917)

  let stringAleatoria = '';
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i += 1) {
    stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return stringAleatoria;
};

window.onload = () => {
  socket.emit('start');
  
  const li = document.createElement('li');
  li.setAttribute('id', 'userName');
  li.setAttribute('data-testid', 'online-user');
  
  li.innerHTML = ramdomName();
  
  document.querySelector('#username-list').appendChild(li);

  const nickname = { newNick: document.querySelector('#userName').innerHTML };
  socket.emit('nick', nickname);
};

messageBtnSend.addEventListener('click', (event) => {
  console.log('funfou');
  event.preventDefault();
  
  const currentDate = `${
    date.getFullYear()}-${
      date.getMonth()}-${date.getDate()} ${
        date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  socket.emit('message', { 
    nickname: document.querySelector('#userName').innerHTML, message: message.value, timestamp: currentDate });
});

nicknameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nick = document.querySelector('#nick');
  console.log('nick', nick, document.querySelector('#nick').value);
  const nickname = { oldNick: document.querySelector('#userName').innerHTML, newNick: nick.value };
    socket.emit('nick', nickname);
  
    document.querySelector('#userName').innerHTML = document.querySelector('#nick').value;
});

socket.on('startMessages', ((data) => {
  console.log(data, 'allmessages');
  data.map((el) => {
    const li = document.createElement('li');
    li.innerHTML = ` ${el.timestamp}-${el.nickname}: ${el.message}`;
    return document.querySelector('#messages-list').appendChild(li);
  });
}));

socket.on('refreshMessages', ((data) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'message');
    li.setAttribute('data-testid', 'online-user');

    li.innerHTML = data;
    return document.querySelector('#messages-list').appendChild(li);
}));

socket.on('refreshNick', ((data) => {
  console.log(data, 'as informações');
  const filteredData = data.filter((el) => el.nickname !== document.querySelector('#userName'));
  if (filteredData.length <= 1) return;
  filteredData.map(({ nickname }) => {
    const li = document.createElement('li');
    li.setAttribute('data-testid', 'online-user');
    li.innerHTML = nickname;
    return document.querySelector('#username-list').appendChild(li);
  });
}));