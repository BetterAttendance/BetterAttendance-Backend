import { Server, Socket } from "socket.io";
import EVENTS from "../events/events";
import CONFIG from "../config/config";
import { Session } from "../interface/session";
import { Quiz } from "../interface/quiz";
import { generateNumQuiz } from "../utils/quizUtils";

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

    // TODO: CREATE DIFFERENT TYPE OF QUIZZES
    const quiz = generateNumQuiz();
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
