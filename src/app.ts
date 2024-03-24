import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { customAlphabet } from 'nanoid';
import EVENTS from './config/events';
import CONFIG from './config/config';
import { createSession, Session } from './session';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CONFIG.corsOrigin,
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
});

const sessions = new Map<String, Session>();

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server is up and running on port: ${CONFIG.PORT}`);

  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    socket.on(EVENTS.DISCONNECT, async () => {
      if (socket.data.session) {
        socket.leave(socket.data.session);
      }
    });

    socket.on(EVENTS.CLIENT.CREATE_SESSION, async (data) => {
      const nanoid = customAlphabet(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        5
      );
      const sessionCode = nanoid();
      socket.data.session = sessionCode;

      sessions.set(sessionCode, createSession({ host: data.host_id }));
      socket.join(sessionCode);

      socket.emit(EVENTS.SERVER.JOIN_SESSION, {
        sessionCode: sessionCode,
      });

      if (CONFIG.DEBUG) {
        console.log(
          `[CREATE_SESSION] Session ${sessionCode} created successfully.`
        );
      }
    });

    socket.on(EVENTS.CLIENT.JOIN_SESSION, async (data) => {
      console.log(`${data.username} joined ${data.sessionCode}`);
      socket.data.username = data.username;
      socket.join(data.sessionCode);
      socket.data.session = data.sessionCode;

      socket.emit(EVENTS.SERVER.JOIN_SESSION, {
        sessionCode: data.sessionCode,
      });
    });

    socket.on(EVENTS.CLIENT.VALIDATE_SESSION, async (data) => {
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
    });

    socket.on(EVENTS.CLIENT.CHECK_IF_HOST, async (data) => {
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
            (isHost
              ? `the host of the session.`
              : `not the host of the session`)
        );
      }
    });

    socket.on(EVENTS.CLIENT.HOST_QUIT_SESSION, async (data) => {
      console.log(`data: ${data.sessionCode}, ${data.userId}`);
      // TODO:
      // 1. Check if the sessionCode is valid, handle if not
      // 2. Check if the user is the host, and handle if not
      // 3. Disconnect all users connected to the session
      // 4. Remove socket.io room
      // 5. Remove session from session list
      // 6. Remove host from hostIDs
      // 7. Notify client

      // socket.leave(data.sessionCode);
      // socket.emit(EVENTS.SERVER.HOST_QUIT_SESSION, data);
    });
  });
});
