import { Server, Socket } from 'socket.io';
import EVENTS from '../events/events';
import CONFIG from '../config/config';
import { Session } from '../interface/session';

export function registerSocketHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>
) {
  const socketDisconnect = async () => {
    const sessionCode = socket.data.session;
    const userId = socket.data.userId;

    if (!sessionCode) {
      return;
    }

    if (!sessions.has(sessionCode)) {
      return;
    }

    if (sessions.get(sessionCode).attendees.has(userId)) {
      sessions.get(sessionCode).attendees.delete(userId);
      socket.leave(sessionCode);

      io.in(sessionCode).emit(EVENTS.UPDATE_USERS, {
        usersConnected: sessions.get(sessionCode).attendees.size,
      });

      if (CONFIG.DEBUG) {
        console.log(`[DISCONNECT] User ${userId} left session ${sessionCode}`);
        console.log(sessions.get(sessionCode));
      }
    }

    if (sessions.get(sessionCode).host === userId) {
      socket.leave(sessionCode);

      io.in(sessionCode).emit(EVENTS.SERVER.HOST_QUIT_SESSION);
      io.in(sessionCode).socketsLeave(sessionCode);

      sessions.delete(sessionCode);
      if (CONFIG.DEBUG) {
        console.log(
          `[DISCONNECT] Host left session ${sessionCode} and the session is destroyed.`
        );
        console.log(sessions);
      }
    }
  };

  socket.on(EVENTS.DISCONNECT, socketDisconnect);
}
