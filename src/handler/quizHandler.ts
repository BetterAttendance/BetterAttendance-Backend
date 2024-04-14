import { Server, Socket } from "socket.io";
import EVENTS from "../events/events";
import CONFIG from "../config/config";
import { Session } from "../interface/session";
import { Quiz } from "../interface/quiz";
import { getRandomInteger, generateNumQuiz, generatePicQuiz, generateTFQuiz } from "../utils/quizUtils";
import { get } from "config";

export function registerQuizHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>,
  quizzes: Quiz[]
) {
  const startQuiz = async (data) => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (
      !sessionCode ||
      !sessions.has(sessionCode) ||
      sessions.get(sessionCode).host != userId
    ) {
      return;
    }

    // Generate a random number from 0 to 2 to choose the type of quiz
    const quizTypeOpt = getRandomInteger(2)
    let quiz: Quiz;
    switch (quizTypeOpt) {
      case 0:
        quiz = generateNumQuiz();
        break;
      case 1:
        quiz = generateTFQuiz();
        break;
      case 2:
        quiz = generatePicQuiz();
        break;
    }
    
    quizzes.push(quiz);

    io.in(sessionCode).emit(EVENTS.SERVER.QUIZ_STARTED, {
      type: quiz.type,
      question: quiz.question,
      options: quiz.options,
      answer: quiz.answer
    });

    if (CONFIG.DEBUG) {
      console.log(`[START_QUIZ] Quiz started for session ${sessionCode}`);
      console.log(`[START_QUIZ] Quiz: ${JSON.stringify(quiz)}`);
    }
  };

  socket.on(EVENTS.CLIENT.START_QUIZ, startQuiz);
}
