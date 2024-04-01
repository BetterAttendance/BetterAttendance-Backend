import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import EVENTS from './events/events';
import CONFIG from './config/config';
import { Session } from './interface/session';
import { registerSessionHandler } from './handler/sessionHandler';
import { registerSocketHandler } from './handler/socketHandler';
import { registerValidationHandler } from './handler/validationHandler';

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
    registerSocketHandler(io, socket, sessions);
    registerSessionHandler(io, socket, sessions);
    registerValidationHandler(io, socket, sessions);
  });
});
