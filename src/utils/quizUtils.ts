import { createQuizInterface } from "../interface/quiz";

// Generate random int from 0 to max
export function getRandomInteger(max: number): number {
    return Math.floor(Math.random() * (max + 1));
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
