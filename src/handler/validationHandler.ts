import { Server, Socket } from 'socket.io';
import EVENTS from '../events/events';
import CONFIG from '../config/config';
import { Session } from '../interface/session';

export function registerValidationHandler(
  io: Server,
  socket: Socket,
  sessions: Map<String, Session>
) {
  const validateSession = async (data) => {
    // Check if sessionCode (hostIDs index) exists
    const isValid = sessions.has(data.sessionCode);

    socket.emit(EVENTS.SERVER.VALIDATE_SESSION, {
      isValid: isValid,
    });

    if (CONFIG.DEBUG) {
      console.log(
        `[VALIDATE_SESSION] The session ${data.sessionCode} ` +
          (isValid ? `exists.` : `doesn't exist.`)
      );
    }
  };

  const checkIfHost = async (data) => {
    const isHost = sessions.get(data.sessionCode).host === data.userID;

    socket.emit(EVENTS.SERVER.CHECK_IF_HOST, {
      isHost: isHost,
    });

    if (CONFIG.DEBUG) {
      console.log(
        `[CHECK_IF_HOST] Requested: ${data.sessionCode} | userId: ${data.userID}`
      );
      console.log(sessions.get(data.sessionCode));
      console.log(
        `The user is ` +
          (isHost ? `the host of the session.` : `not the host of the session`)
      );
    }
  };

  socket.on(EVENTS.CLIENT.VALIDATE_SESSION, validateSession);
  socket.on(EVENTS.CLIENT.CHECK_IF_HOST, checkIfHost);
}
