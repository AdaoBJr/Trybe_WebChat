window.onload = () => {};
const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

const nickNameRandom = Math.random().toString(36).substring(2, 10)
+ Math.random().toString(36).substring(2, 10);

console.log(nickNameRandom);