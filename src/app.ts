import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import EVENTS from './events/events';
import CONFIG from './config/config';
import { Session } from './interface/session';
import { registerSessionHandler } from './handler/sessionHandler';
import { registerSocketHandler } from './handler/socketHandler';
import { registerQuizHandler } from './handler/quizHandler';
import path from 'path';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CONFIG.corsOrigin,
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
});

const sessions = new Map<string, Session>();

app.get('/download_csv/:filename', (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(CONFIG.OUTPUT_DIR, filename + '.csv'); // Specify the file path

  res.download(filePath, filename + '.csv', (err) => {
    if (err) {
      console.error('File download failed:', err);
    }
  });
});

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server is up and running on port: ${CONFIG.PORT}`);

  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    registerSocketHandler(io, socket, sessions);
    registerSessionHandler(io, socket, sessions);
    registerQuizHandler(io, socket, sessions);
  });
});
