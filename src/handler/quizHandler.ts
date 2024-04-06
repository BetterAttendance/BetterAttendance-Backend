import { Server, Socket } from "socket.io";
import EVENTS from "../events/events";
import CONFIG from "../config/config";
import { Session } from "../interface/session";

export function registerQuizHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>
) {
  const startQuiz = async (data) => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (!sessionCode) {
      return;
    }

    if (!sessions.has(sessionCode)) {
      return;
    }

    if (sessions.get(sessionCode).host != userId) {
      return;
    }

    io.in(sessionCode).emit(EVENTS.SERVER.QUIZ_STARTED, {
      quiz: "This is a quiz",
    });

    if (CONFIG.DEBUG) {
      console.log(`[START_QUIZ] Quiz started for session ${sessionCode}`);
    }
  };

  socket.on(EVENTS.CLIENT.START_QUIZ, startQuiz);
}
