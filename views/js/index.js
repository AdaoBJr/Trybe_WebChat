const socket = window.io();

    const inboxPeople = document.querySelector('#users-online');
    const inboxMessage = document.querySelector('#messages');
    const inputMessage = document.querySelector('#input-message');
    const formMessage = document.querySelector('#form-message');
    const formNickname = document.querySelector('#form-aside');
    const NicknameInput = document.querySelector('#name');

    let userName = '';

    const addNewMessage = (chatMessage) => {
      const receivedMsg = document.createElement('li');
      receivedMsg.setAttribute('data-testid', 'message');
      receivedMsg.innerText = chatMessage;
      inboxMessage.appendChild(receivedMsg);
    };

    /*
      Função para gerar nickName randomizado
      FONTE: https://www.ti-enxame.com/pt/javascript/gere-stringcaracteres-aleatorios-em-javascript/967048592/
    */
      const dec2hex = (dec) => (`0${dec.toString(16)}`).substr(-2);
      const generateNickName = (len) => {
        const arr = new Uint8Array((len || 40) / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr, dec2hex).join('');
      };
      
      const addToUsersBox = (nickName) => {
        if (document.getElementById(`${nickName}`)) {
          return;
        }
        sessionStorage.setItem('nickname', nickName); 
        const userBox = document.createElement('li');
        userBox.setAttribute('data-testid', 'online-user');
        userBox.setAttribute('id', `${nickName}`);
        userBox.innerText = nickName;
        inboxPeople.appendChild(userBox);
      };

    const newUserConnected = (user) => {
      userName = user || generateNickName(16);
      socket.emit('new user', userName);
      addToUsersBox(userName);
      sessionStorage.setItem('nickname', userName);
    };

/* Function that modifies the positions of the array that 
 will be rendered, always putting the user first in the list 
 Font used as base, modified for use in this app.
 Link: https://www.horadecodar.com.br/2020/03/30/javascript-mudar-a-posicao-de-um-elemento-no-array/
*/
    const changePosition = (arr, from, to) => {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      return arr;
    };

// new user is created so we generate nickname and emit event
    newUserConnected();

    // FORM --------------------------------------------------------
    formMessage.addEventListener('submit', (e) => {
      e.preventDefault();
      socket.emit('message', {
        chatMessage: inputMessage.value,
        nickname: userName,
      });
      inputMessage.value = '';
      return false;
    });

    formNickname.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldNick = userName;
        userName = NicknameInput.value;
        NicknameInput.value = '';
        socket.emit('edit user', { nick: userName, oldNick });
    });

    socket.on('new user', ({ onUsers: data, arrayOfMessages }) => {
      inboxPeople.textContent = '';
      const userExist = data.findIndex((element) => element.data === userName);

      if (userExist === -1) { console.log('desculpe problemas no array de usuario'); }
      const newArryData = changePosition(data, userExist, 0);
      newArryData.forEach((user) => addToUsersBox(user.data));
      arrayOfMessages.forEach((obj) => addNewMessage(obj.message));
    });

    socket.on('edit user', (data) => {
      inboxPeople.textContent = '';
      const userExist = data.findIndex((element) => element.data === userName);
      
      if (userExist === -1) { console.log('desculpe ocorreu algum problema'); }
      const newArryData = changePosition(data, userExist, 0);
      newArryData.forEach((user) => addToUsersBox(user.data));
    });

    socket.on('message', (message) => {
      addNewMessage(message);
    });

    socket.on('user disconnected', ({ data }) => {
      document.getElementById(`${data}`).remove();
    });