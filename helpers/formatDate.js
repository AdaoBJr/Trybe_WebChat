const formatDate = () => {
  const newDate = new Date();
  const dia = String(newDate.getDate());
  const mes = String(newDate.getMonth());
  const ano = String(newDate.getFullYear());
  const hora = newDate.getHours();
  const minuto = newDate.getMinutes();
  return `${dia}-${mes}-${ano} ${hora}:${minuto}`;
};

module.exports = formatDate;