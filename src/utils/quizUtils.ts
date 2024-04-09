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
