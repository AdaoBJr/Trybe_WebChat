// https://www.youtube.com/watch?v=Hr5pAAIXjkA&ab_channel=DevPleno
const randomString = (length) => {
  let nickname = '';
  do {
    nickname += Math.random().toString(36).substr(2);
  } while (nickname.length < length);
  nickname = nickname.substr(0, length);
  return nickname;
};

module.exports = randomString;