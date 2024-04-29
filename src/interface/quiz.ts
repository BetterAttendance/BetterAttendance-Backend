import { getRandomInteger } from '../utils/utils';
import CONFIG from '../config/config';

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
      options = data.options || ['pic_1.gif', 'pic_2.gif', 'pic_3.gif'];
      answer = data.answer || 'pic_1';
      break;
    case CONFIG.QUIZ.TYPE.TF:
      question = data.question || 'Is the sky blue?';
      options = data.options || ['True', 'False'];
      answer = data.answer || 'True';
      break;
    // Add more cases for other types if needed
    // Default is multiple choice
    default:
      // Default to multiple choice if type is not specified or invalid
      question = data.question || 'Choose the correct number:';
      options = data.options || ['1', '2', '3'];
      answer = data.answer || '1';
      break;
  }

  return {
    type: data.type || CONFIG.QUIZ.TYPE.NUMBER,
    question: data.question || null,
    options: options,
    answer: answer,
  };
}

export function generateNumQuiz() {
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

export function generateTFQuiz() {
  const question = 'Is Japan an island';
  const answer = 'False';

  return createQuizInterface({
    type: CONFIG.QUIZ.TYPE.TF,
    question: question,
    answer: answer,
  });
}

export function generatePicsQuiz() {
  // Generate 3 random unrepeating numbers from 1 to 4 to display 3 pictures on the client side
  const options = [];
  for (let i = 0; i < 3; i++) {
    let randomNum = getRandomInteger(3) + 1;
    while (options.includes(`pic_${randomNum}.gif`)) {
      randomNum = getRandomInteger(3) + 1;
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
