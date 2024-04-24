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

  const sendResults = async (data) => {
    const sessionCode = socket.data.session;

    if (CONFIG.DEBUG) {
      console.log(`[END_QUIZ] Quiz ended for session ${sessionCode}`);
      console.log(sessions.get(data.sessionCode));

      // Print the final results of all attendees
      sessions.get(sessionCode).attendees.forEach((value, key) => {
        console.log(`[END_QUIZ] User ${key} has ${value.correctAns} correct answers.`);
      });
    }

    // If the attendees have answered 3 or more questions correctly, mark as attended
    // To Host
    const recordedUsers = [];     // Recorded names
    const unrecordedUsers = [];   // Unrecorded names
    
    // To Attendees
    const recordedIds = [];   // Recorded ids to check if the user is recorded
    sessions.get(sessionCode).attendees.forEach((value, key) => {
      if (value.correctAns >= 3) {
        recordedUsers.push(value.username);
        recordedIds.push(key);
      } else {
        unrecordedUsers.push(value.username);
      }
    });

    // Send the final results to the clients
    io.in(sessionCode).emit(EVENTS.SERVER.END_QUIZ, {
      recordedUsers: recordedUsers,
      unrecordedUsers: unrecordedUsers,
      recordedIds: recordedIds
    });
  }


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

    if (sessions.get(sessionCode).quizzes.length != 0) {
      io.in(sessionCode).emit(EVENTS.SERVER.NEXT_QUIZ, {
        type: sessions.get(sessionCode).quizzes[0].type,
        question: sessions.get(sessionCode).quizzes[0].question,
        options: sessions.get(sessionCode).quizzes[0].options,
        answer: sessions.get(sessionCode).quizzes[0].answer
      });

      if (CONFIG.DEBUG) {
        console.log(`[NEXT_QUIZ] Time up. Sending next quiz to session ${sessionCode}`);
        console.log(sessions.get(data.sessionCode));
      }
    } else {
      sendResults(data);
    }
  }

  socket.on(EVENTS.CLIENT.START_QUIZ, fetchQuiz);
  socket.on(EVENTS.CLIENT.NEXT_QUIZ, sendNextQuiz);
  socket.on(EVENTS.CLIENT.SUBMIT_ANSWER, validateAnswer);
}
