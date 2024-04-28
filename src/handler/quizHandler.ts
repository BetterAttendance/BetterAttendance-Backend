import { Server, Socket } from "socket.io";
import EVENTS from "../events/events";
import CONFIG from "../config/config";
import { Session } from "../interface/session";
import { Quiz, generateNumQuiz, generatePicQuiz, generateTFQuiz } from "../interface/quiz";
import { getRandomInteger } from "../utils/utils";

export function registerQuizHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>,
) {
  const fetchQuiz = async (data) => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (
      !sessionCode ||
      !sessions.has(sessionCode) ||
      sessions.get(sessionCode).host != userId
    ) {
      return;
    }

    // Set the session status to 'running' to prevent further joins
    sessions.get(sessionCode).status = "running";

    // Generate 4 quizzes for the session
    const quizzes = [];
    for (let i = 0; i < 4; i++) {
      const random = getRandomInteger(2);
      let quiz: Quiz;
      if (random === 0) {
        quiz = generateNumQuiz();
      } else if (random === 1) {
        quiz = generatePicQuiz();
      } else {
        quiz = generateTFQuiz();
      }
      quizzes.push(quiz);
    }

    // Save the quizzes to the session object
    sessions.get(sessionCode).quizzes = quizzes;

    // Send the quiz attributes to the clients
    io.in(sessionCode).emit(EVENTS.SERVER.QUIZ_STARTED, {
      type: sessions.get(sessionCode).quizzes[0].type,
      question: sessions.get(sessionCode).quizzes[0].question,
      options: sessions.get(sessionCode).quizzes[0].options,
      answer: sessions.get(sessionCode).quizzes[0].answer
    });

    if (CONFIG.DEBUG) {
      console.log(`[START_QUIZ] Quiz started for session ${sessionCode}`);
      console.log(`[START_QUIZ] Quiz: ${JSON.stringify(sessions.get(sessionCode).quizzes[0])}`);
    }
  };

  
  const validateAnswer = async (data) => {
    // Receive data: sessionCode, opt
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    // Check if the session exists and the user is in the session
    if (!sessionCode || !sessions.has(sessionCode)) {
      return;
    }

    // Mark the user as answered
    sessions.get(sessionCode).answeredAttendees += 1;

    // Check if the user answer is correct, if so then increment the correctAnswers counter for the user
    const quiz = sessions.get(sessionCode).quizzes[0]
    const isCorrect = quiz.answer === data.opt;
    if (isCorrect) {
      sessions.get(sessionCode).attendees.get(userId).correctAns += 1;
    }

    if (CONFIG.DEBUG) {
      console.log(`[SUBMIT_ANSWER] User ${userId} from session ${sessionCode} submitted answer: ${data.opt} -> ${isCorrect}`);
      console.log(`[SUBMIT_ANSWER] Quiz: ${JSON.stringify(sessions.get(sessionCode).quizzes[0])}`);
    }
  }


  const sendNextQuiz = async (data) => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (
      !sessionCode ||
      !sessions.has(sessionCode) ||
      sessions.get(sessionCode).host != userId
    ) {
      return;
    }

    sessions.get(sessionCode).quizzes.shift();  // Remove the first quiz from the array
    sessions.get(sessionCode).answeredAttendees = 0;  // Reset the answered attendees counter

    if (CONFIG.DEBUG) {
      console.log(`[NEXT_QUIZ] Time up. Sending next quiz to session ${sessionCode}`);
      console.log(sessions.get(data.sessionCode));
    }

    // If there are more quizzes, send the next quiz to the clients
    if (sessions.get(sessionCode).quizzes.length != 0) {
      // To host
      io.in(sessionCode).emit(EVENTS.SERVER.NEXT_QUIZ, {
        type: sessions.get(sessionCode).quizzes[0].type,
        question: sessions.get(sessionCode).quizzes[0].question,
        options: sessions.get(sessionCode).quizzes[0].options,
        answer: sessions.get(sessionCode).quizzes[0].answer
      });

      // To all attendees
      io.in(sessionCode).except(socket.id).emit(EVENTS.SERVER.NEXT_QUIZ, {
        type: sessions.get(sessionCode).quizzes[0].type,
        question: sessions.get(sessionCode).quizzes[0].question,
        options: sessions.get(sessionCode).quizzes[0].options,
      });
    } else {
      // If there are no more quizzes, end the quiz
      sessions.get(sessionCode).status = "ended";

      // Notify the host and attendees that the quiz has ended
      io.in(sessionCode).emit(EVENTS.SERVER.END_QUIZ);
      console.log(`[NEXT_QUIZ] Quiz ended for session ${sessionCode}`);
      console.log(sessions.get(data.sessionCode));
    }
  }


  const sendResult = async (data) => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (userId === sessions.get(sessionCode).host) {
      const recordedUsers = [];     
      const unrecordedUsers = [];
      sessions.get(sessionCode).attendees.forEach((value, key) => {
        if (value.correctAns >= 3) {
          recordedUsers.push(value.username);
        } else {
          unrecordedUsers.push(value.username);
        }
      });

      io.to(socket.id).emit(EVENTS.SERVER.QUIZ_RESULT, {
        recordedUsers: recordedUsers,
        unrecordedUsers: unrecordedUsers,
      });

      if (CONFIG.DEBUG) {
        console.log(`[QUIZ_RESULT] Quiz result sent to host ${userId} for session ${sessionCode}`);
        console.log(`[QUIZ_RESULT] Recorded users: ${recordedUsers}`);
        console.log(`[QUIZ_RESULT] Unrecorded users: ${unrecordedUsers}`);
      }
    } else {
      let result = sessions.get(sessionCode).attendees.get(userId).correctAns
      io.to(socket.id).emit(EVENTS.SERVER.QUIZ_RESULT, {
        result: result,
      });

      if (CONFIG.DEBUG) {
        console.log(`[QUIZ_RESULT] Quiz result sent to attendee ${userId} for session ${sessionCode}`);
        console.log(`[QUIZ_RESULT] Correct answers: ${result}/4`);
      }
    }
  }

  socket.on(EVENTS.CLIENT.START_QUIZ, fetchQuiz);
  socket.on(EVENTS.CLIENT.NEXT_QUIZ, sendNextQuiz);
  socket.on(EVENTS.CLIENT.SUBMIT_ANSWER, validateAnswer);
  socket.on(EVENTS.CLIENT.END_QUIZ, sendResult);
}
