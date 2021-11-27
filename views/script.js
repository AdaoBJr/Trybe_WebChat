// const io = require('socket.io-client');

// function makeId(length) {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i += 1) {
//   result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
//   }

const socket = window.io();
// window.onload = () => {
//   socket.emit('onload');
// };

// Força a desconexão do usuário
window.onbeforeunload = () => {
  socket.disconnect('this');
};

const btnNickname = document.querySelector('#nickname-button');
btnNickname.addEventListener('click', (event) => {
  event.preventDefault();
  const nickname = document.querySelector('#nickname-box');
  socket.emit('setNickname', { username: nickname.value });
  nickname.value = '';
});

const btnSendMessage = document.querySelector('#send-button');
btnSendMessage.addEventListener('click', (event) => {
  event.preventDefault();
  const chatMessage = document.querySelector('#message-box');
  const message = { chatMessage: chatMessage.value };
  
  socket.emit('message', message);

  chatMessage.value = '';
});

const createElementByTag = ({ tag, text, dataTestId }) => {
  const tagElement = document.createElement(tag);
  const tagText = document.createTextNode(text);
  tagElement.append(tagText);
  tagElement.setAttribute('data-testid', dataTestId);
  return tagElement;
};

const updateChat = (message) => {
  // document.querySelector('#online-user')
  //   .appendChild(createElementByTag({tag: 'li', text: message.nickname}));

  document.querySelector('#message')
    .appendChild(createElementByTag({ tag: 'li', text: message }));
};

// socket.on('chatHistory', (chatHistory) => {
//   chatHistory.forEach(updateChat);
// });

socket.on('message', updateChat);

const updateUsersOnline = ({ usersOnline }) => {
  const onlineUser = document.querySelector('#online-user');
  onlineUser.innerHTML = '';
  const me = usersOnline.find((user) => user.id === socket.id);
  onlineUser.appendChild(
    createElementByTag({ tag: 'li', text: me.username, dataTestId: 'online-user' }),
    );
  // const index = usersOnline.indexOf(me.);
  // console.log('usersOnline: ', socket.id);
  // usersOnline.slice(index, 1);
  // console.log('usersOnlin ', usersOnline);

  usersOnline.forEach((user) => {
    if (user !== me) {
      onlineUser.appendChild(
        createElementByTag({ tag: 'li', text: user.username, dataTestId: 'online-user' }),
      );
    }
  });
};

socket.on('updateUsersOnline', updateUsersOnline);