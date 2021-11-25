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
window.onload = () => {
  socket.emit('onload');
};

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const chatMessage = document.querySelector('#message-box');
  const nickname = document.querySelector('#nickname-box').value;
  console.log('nickname: ', nickname, 'chatMessage: ', chatMessage.value);
  const message = { nickname, chatMessage: chatMessage.value };
  
  // if (nickname.value !== '') { message.nickname = generateUsername('', 0, 16); }
  
  socket.emit('message', message);

  chatMessage.value = '';

  return false;
});

const createElementByTag = ({ tag, text }) => {
  const tagElement = document.createElement(tag);
  const tagText = document.createTextNode(text);
  tagElement.append(tagText);
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