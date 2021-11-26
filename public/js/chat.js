const socket = window.io();

let nickname;

const createMessage = (message) => {
  const ul = document.querySelector('#message');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  ul.appendChild(li);
};

const btnMessage = document.querySelector('#btnMessage');
const inputMessage = document.querySelector('#inputMessage');
btnMessage.addEventListener('click', () => {
  const message = inputMessage.value;
  socket.emit('message', { chatMessage: message, nickname });
  inputMessage.value = '';
});

const createUser = (user) => {
  const ul = document.querySelector('#user');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', user.userID);
  if (socket.id === user.userID) nickname = user.nickname;
  li.innerText = user.nickname;
  ul.appendChild(li);
};

const updateUser = (newNickname) => {
  const li = document.getElementById(newNickname.userID);
  if (socket.id === newNickname.userID) nickname = newNickname.nickname;
  li.innerText = newNickname.nickname;
  socket.emit('newNickname', newNickname); 
};

const deleteUser = (userId) => {
  const li = document.getElementById(userId);
  li.remove();
};

const btnNickname = document.querySelector('#btnNickname');
const inputUser = document.querySelector('#inputNickname');
btnNickname.addEventListener('click', () => {
  nickname = inputUser.value;
  socket.emit('users', { nickname: inputUser.value, userID: socket.id });
  inputUser.value = '';
});

// const orderUser = (userList) => {
//   const firstUser = userList.find((user) => user.userID === socket.id);
//   // const firstUser = userList.filter((p) => p.userID === socket.id);
  
//   console.log('userList', userList);
//   const i = userList.findIndex((list) => list.userID === socket.id);
//   const otherUsers = userList.splice(i, 1);

//   const newUserList = otherUsers.splice(0, 0, firstUser);
  
//   // const newUserList = otherUsers.unshift(firstUser);
  
//   console.log('firstUser', firstUser);
//   console.log('otherUsers', otherUsers);
//   console.log(newUserList);
//   // const firstUser = userList.filter((p) => p.userID === socket.id);
//   // const otherUsers = userList.filter((p) => p.userID !== socket.id);
//   // return newUserList;
//   // return newUserList.forEach((user) => createUser(user));
// };

socket.on('users', (user) => createUser(user));
socket.on('message', (message) => createMessage(message));
socket.on('nickname', (newNickname) => updateUser(newNickname));
socket.on('newConnection', (historic) => historic.forEach((message) => createMessage(message)));
socket.on('userOnline', (userList) => {
  const i = userList.findIndex((list) => list.userID === socket.id);
  userList.splice(i, 1);
  userList.forEach((user) => createUser(user));
});
// socket.on('userOnline', (userList) => orderUser(userList));
socket.on('userOff', (userId) => deleteUser(userId));