const today = new Date();

const dd = String(today.getDate());
const mm = String(today.getMonth());
const yyyy = today.getFullYear();
const hh = today.getHours();
const min = today.getMinutes();

const now = `${dd}-${mm}-${yyyy} ${hh}:${min}`;

module.exports = now;
