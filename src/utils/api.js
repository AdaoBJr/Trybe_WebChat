const ENDPOINT = 'http://localhost:3000/messages';

module.exports = async () => {
  const response = await fetch(ENDPOINT);
  return response.json();
};
