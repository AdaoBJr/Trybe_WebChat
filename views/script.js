const user = window.io();

function randomStringGenerator(size) {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < size; i += 1) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
}

window.onload = () => {
  const randomNickname = randomStringGenerator(16);
  user.emit('newUser', randomNickname);
  localStorage.setItem('user', JSON.stringify(randomNickname));

  user.emit('onlineUsers', '');
};

user.on('newUser', (nickname) => {
  const element = document.createElement('li');
  element.innerText = `${nickname} entrou`;
  document.querySelector('.chatMessages')
    .appendChild(element);
});

user.on('onlineUsers', (clients) => {
  document.querySelector('.listUsers').innerText = '';

  const newClient = clients.find((client) => client.userId === user.id);
  const allClients = clients.filter((client) => client.userId !== user.id);
  allClients.unshift(newClient);

  allClients.forEach((client) => {
    const userElement = document.createElement('li');
    userElement.setAttribute('data-testid', 'online-user');
    userElement.innerText = client.nickname;
    document.querySelector('.listUsers').appendChild(userElement);
  });
});

document.querySelector('.sendButton')
  .addEventListener('click', () => {
    user.emit('message', {
      chatMessage: document.querySelector('.messageBox').value,
      nickname: JSON.parse(localStorage.getItem('user')),
    });
    document.querySelector('.messageBox').value = '';
  });

  user.on('message', (message) => {
  const element = document.createElement('li');
  element.innerText = message;
  element.setAttribute('data-testid', 'message');
  document.querySelector('.chatMessages')
    .appendChild(element);
});

document.querySelector('.nicknameButton').addEventListener('click', () => {
  const inputNick = document.querySelector('.nicknameBox');
  localStorage.setItem('user', JSON.stringify(inputNick.value));
  user.emit('updateUser', inputNick.value);
  inputNick.value = '';
}); 

user.on('disconnectUser', () => {
  localStorage.clear();
});
