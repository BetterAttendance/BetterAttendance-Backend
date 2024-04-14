import { Server, Socket } from "socket.io";
import EVENTS from "../events/events";
import CONFIG from "../config/config";
import { Session } from "../interface/session";
import { Quiz } from "../interface/quiz";
import { getRandomInteger, generateNumQuiz, generatePicQuiz, generateTFQuiz } from "../utils/quizUtils";

export function registerQuizHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>,
  answers: Map<String, string>,   //  Map of sessionCode to answer
) {
  // Note: We do not save the quiz object, only the answer
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

    io.in(sessionCode).emit(EVENTS.SERVER.QUIZ_STARTED, {
      type: quiz.type,
      question: quiz.question,
      options: quiz.options,
      answer: quiz.answer
    });

    // Store the answer for the quiz to validate later
    answers.set(sessionCode, quiz.answer);

    if (CONFIG.DEBUG) {
      console.log(`[START_QUIZ] Quiz started for session ${sessionCode}`);
      console.log(`[START_QUIZ] Quiz: ${JSON.stringify(quiz)}`);
    }
  };

  const validateAnswer = async (data) => {
    // Receive data: sessionCode, selectedOption
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    // Check if the session exists and the user is in the session
    if (!sessionCode || !sessions.has(sessionCode)) {
      return;
    }

    // If the user did not answer the quiz, we mark it as incorrect
    // Check if the user response is correct
    const isCorrect = data.selectedOpt === answers.get(sessionCode);
    // Get the attendence map of the session and update the user's attendance
    sessions.get(sessionCode).attendance.set(userId, isCorrect);

    if (CONFIG.DEBUG) {
      console.log(`[SUBMIT_ANSWER] User ${userId} from session ${sessionCode} submitted answer: ${data.selectedOpt}`);
      console.log(`[SUBMIT_ANSWER] Answer is correct: ${isCorrect}`);
      console.log(sessions.get(data.sessionCode));
    }
  }

  // TODO: RETURN QUIZ RESULT TO CLIENT (AFTER ALL USERS HAVE ANSWERED OR TIME IS UP)

  socket.on(EVENTS.CLIENT.START_QUIZ, startQuiz);
  socket.on(EVENTS.CLIENT.SUBMIT_ANSWER, validateAnswer);
}
