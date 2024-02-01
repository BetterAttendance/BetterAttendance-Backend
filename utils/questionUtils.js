// get random integer from 0 to max (max exclusive)
function getRandomInteger(max) {
  // return Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.floor(Math.random() * max);
}

function generateQuestion() {
  const questions = [];

  for (let i = 0; i < 3; i++) {
    questions.push(getRandomInteger(99) + 1);
  }
  return questions;
}

module.exports = { getRandomInteger, generateQuestion };
