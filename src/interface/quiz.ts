export interface Quiz {
    question: string;
    options: string[];
    answer: string;
}

// Default will be a quiz with a single question with 3 options and the first option as the answer
export function createQuizInterface(data: Partial<Quiz> = {}): Quiz {
    return {
        question: data.question || null,
        options: data.options || ['Paris', 'London', 'Berlin'],
        answer: data.answer || 'Paris',
    };
}