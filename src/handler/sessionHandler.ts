import { Server, Socket } from 'socket.io';
import { customAlphabet } from 'nanoid';
import EVENTS from '../events/events';
import CONFIG from '../config/config';
import { createSessionInterface, Session } from '../interface/session';

export function registerSessionHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>
) {
  const createSession = async (data) => {
    const nanoid = customAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      5
    );
    const sessionCode = nanoid();
    socket.data.session = sessionCode;
    socket.data.userId = data.userId;

    sessions.set(sessionCode, createSessionInterface({ host: data.userId }));
    socket.join(sessionCode);

    io.in(sessionCode).emit(EVENTS.UPDATE_USERS, {
      usersConnected: 0,
    });

    socket.emit(EVENTS.SERVER.JOIN_SESSION, {
      sessionCode: sessionCode,
    });

    if (CONFIG.DEBUG) {
      console.log(
        `[CREATE_SESSION] Session ${sessionCode} created successfully.`
      );
    }
  };

  const joinSession = async (data) => {
    //  For Khoi!!
    // TODO: Validate if session is exists and if user is a host, and handle it properly.

    sessions.get(data.sessionCode).attendees.set(data.userId, data.username);

    socket.data.session = data.sessionCode;
    socket.data.userId = data.userId;
    socket.join(data.sessionCode);

    io.in(data.sessionCode).emit(EVENTS.UPDATE_USERS, {
      usersConnected: sessions.get(data.sessionCode).attendees.size,
    });

    socket.emit(EVENTS.SERVER.JOIN_SESSION, {
      sessionCode: data.sessionCode,
    });

    if (CONFIG.DEBUG) {
      console.log(`[JOIN_SESSION] ${data.username} joined ${data.sessionCode}`);
      console.log(sessions.get(data.sessionCode));
    }
  };

  const attendeeQuitSession = async (data) => {
    // TODO: Handle if sessionCode or attendee not found
    const sessionCode = data.sessionCode;
    const userId = data.userId;

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
      console.log(
        `[ATTENDEE_QUIT_SESSION] User ${userId} left session ${sessionCode}`
      );
      console.log(sessions.get(sessionCode));
    }
  };

  const hostQuitSession = async (data) => {
    const sessionCode = data.sessionCode;
    const userId = data.userId;

    // TODO:
    // 1. Check if the sessionCode is valid, handle if not
    if (!sessions.has(sessionCode)) {
      return;
    }

    // 2. Check if the user is the host, and handle if not ??
    if (sessions.get(sessionCode).host !== userId) {
      return;
    }

    // 3. Disconnect all users connected to the session
    io.in(sessionCode).emit(EVENTS.DISCONNECT_USERS);

    // 4. Remove socket.io room
    // 5. Remove session from session list
    // 6. Remove host from hostIDs
    // 7. Notify client
    // socket.leave(data.sessionCode);
    // socket.emit(EVENTS.SERVER.HOST_QUIT_SESSION, data);
  };

  socket.on(EVENTS.CLIENT.CREATE_SESSION, createSession);
  socket.on(EVENTS.CLIENT.JOIN_SESSION, joinSession);
  socket.on(EVENTS.CLIENT.ATTENDEE_QUIT_SESSION, attendeeQuitSession);
  socket.on(EVENTS.CLIENT.HOST_QUIT_SESSION, hostQuitSession);
}
