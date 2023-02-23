const accountNumberGenerator = () => {
  const date = new Date();
  const now =
    date.getSeconds().toString() +
    date.getDate().toString() +
    date.getDay().toString() +
    date.getFullYear().toString() +
    date.getHours().toString() +
    date.getFullYear().toString();

  const randomNumber = Math.floor(
    Math.random() * (999 - 111 + 1) + 111
  ).toString();

  return +(now + randomNumber);
};

module.exports = accountNumberGenerator;
