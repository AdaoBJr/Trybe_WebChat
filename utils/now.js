const today = new Date();

const day = String(today.getDate());
const month = String(today.getMonth());
const year = today.getFullYear();
const hour = today.getHours();
const min = today.getMinutes();

const now = `${day}-${month}-${year} ${hour}:${min}`;

module.exports = now;
