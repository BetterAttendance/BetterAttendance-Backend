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

    if (!sessions.get(sessionCode).attendees.has(userId)) {
      return;
    }

    sessions.get(sessionCode).attendees.delete(userId);
    socket.leave(sessionCode);

    io.in(sessionCode).emit(EVENTS.UPDATE_USERS, {
      usersConnected: sessions.get(sessionCode).attendees.size,
    });

    if (CONFIG.DEBUG) {
      console.log(`[DISCONNECT] User ${userId} left session ${sessionCode}`);
      console.log(sessions.get(sessionCode));
    }
  };

  socket.on(EVENTS.DISCONNECT, socketDisconnect);
}
