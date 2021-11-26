const formattedDateAndHour = () => {
  const date = new Date();
  const currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const fullHour = `${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`;
  const pmOrAm = fullHour < 12 ? 'AM' : 'PM';
  return `${currentDate} ${fullHour} ${pmOrAm}`;
};

module.exports = { formattedDateAndHour };