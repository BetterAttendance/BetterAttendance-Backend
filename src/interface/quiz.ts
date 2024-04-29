import { getRandomInteger } from '../utils/utils';
import CONFIG from '../config/config';
import OBJECT_BANK from '../utils/object_bank';

export interface Quiz {
  type: string;
  question: string;
  options: string[];
  answer: string;
}

// Default will be a quiz with a single question with 3 options and the first option as the answer
export function createQuizInterface(data: Partial<Quiz> = {}): Quiz {
  let question: string;
  let options: string[];
  let answer: string;

  // Handling different types of quizzes
  switch (data.type) {
    case CONFIG.QUIZ.TYPE.PICS:
      question = 'Choose the correct picture shown on the host screen';
      options = data.options;
      answer = data.answer;
      break;
    case CONFIG.QUIZ.TYPE.OBJECT:
      question = 'Choose the correct object shown on the host screen';
      options = data.options;
      answer = data.answer;
      break;
    case CONFIG.QUIZ.TYPE.NUMBER:
      question = 'Choose the correct number shown on the host screen';
      options = data.options;
      answer = data.answer;
      break;

    default:
      question = 'What is the answer to life, the universe, and everything?';
      options = ['69420'];
      answer = '69420';
      break;
  }

  return {
    type: data.type || 'undefined',
    question: question,
    options: options,
    answer: answer,
  };
}

export function generateNumberQuiz() {
  const options = [];

  for (let i = 0; i < CONFIG.QUIZ.MAX_OPTIONS; i++) {
    options.push((getRandomInteger(99) + 1).toString());
  }
  const answer = options[getRandomInteger(options.length - 1)];

  return createQuizInterface({
    type: CONFIG.QUIZ.TYPE.NUMBER,
    options: options,
    answer: answer,
  });
}

export function generateObjectQuiz() {
  const options = [];

  for (let i = 0; i < CONFIG.QUIZ.MAX_OPTIONS; i++) {
    options.push(OBJECT_BANK[getRandomInteger(OBJECT_BANK.length) - 1]);
  }
  const answer = options[getRandomInteger(options.length - 1)];

  return createQuizInterface({
    type: CONFIG.QUIZ.TYPE.OBJECT,
    options: options,
    answer: answer,
  });
}

// TODO: Implement the generatePicsQuiz function
export function generatePicsQuiz() {
  // Generate 3 random unrepeating numbers from 1 to 4 to display 3 pictures on the client side
  const options = [];
  for (let i = 0; i < CONFIG.QUIZ.MAX_OPTIONS; i++) {
    let randomNum = getRandomInteger(CONFIG.QUIZ.MAX_PICS) + 1;
    while (options.includes(`pic_${randomNum}.gif`)) {
      randomNum = getRandomInteger(CONFIG.QUIZ.MAX_PICS) + 1;
    }
    options.push(`pic_${randomNum}.gif`);
  }

  // Choose a random picture from the options list as the answer
  const answer = options[getRandomInteger(options.length - 1)];

  return createQuizInterface({
    type: CONFIG.QUIZ.TYPE.PICS,
    options: options,
    answer: answer,
  });
}
