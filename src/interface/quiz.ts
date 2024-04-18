import { getRandomInteger } from '../utils/utils';

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
        case 'multiple_choice_with_pic':
            options = data.options || ["pic_1.gif", "pic_2.gif", "pic_3.gif"];
            answer = data.answer || 'pic_1';
            break;
        case 'true_false':
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
        type: data.type || 'multiple_choice',
        question: data.question || null,
        options: options,
        answer: answer,
    };
}

export function generateNumQuiz() {
    const quizzes = [];
  
    for (let i = 0; i < 3; i++) {
        quizzes.push((getRandomInteger(99) + 1).toString());
    }
  
    const answer = quizzes[getRandomInteger(quizzes.length - 1)];
    const quiz = createQuizInterface({ options: quizzes, answer: answer});
    return quiz;
  }
  
  export function generateTFQuiz() {
    const question = 'Is Japan an island';
    const answer = 'False';
    const quiz = createQuizInterface({ type: 'true_false', question, answer });
    return quiz;
  }
  
  export function generatePicQuiz() {
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
  
    const quiz = createQuizInterface({ type: 'multiple_choice_with_pic', options, answer });
    return quiz;
  }