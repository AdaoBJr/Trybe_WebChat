module.exports = () => {
  const date = new Date();
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    
  return `${day}-${month}-${year} ${hours}:${minutes} `;
};
