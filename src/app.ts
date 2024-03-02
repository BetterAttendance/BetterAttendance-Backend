import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { customAlphabet } from 'nanoid';
import EVENTS from './config/events';
import CONFIG from './config/config';

const DEBUG = true;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CONFIG.corsOrigin,
    credentials: true,
  },
  maxHttpBufferSize: 1e8,
});

const hostIDs = {};

httpServer.listen(CONFIG.PORT, () => {
  console.log(`Server is up and running on port: ${CONFIG.PORT}`);

  io.on(EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`User ${socket.id} is connected.`);

    socket.on(EVENTS.DISCONNECT, async () => {
      if (socket.data.session) {
        socket.leave(socket.data.session);
      }
      console.log(`User ${socket.id} is disconnected.`);
    });

    socket.on(EVENTS.CLIENT.CREATE_SESSION, async (data) => {
      // As we switched from socketID to userID to identify hosts, it is no need for now
      // socket.data.host_id = data.host_id;
      
      const nanoid = customAlphabet(
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        5
      );
      const sessionID = nanoid();
      socket.data.session = sessionID;
      
      // Saving to the maps of hostIDs with index based on sessionID
      hostIDs[sessionID] = data.host_id;

      console.log(`${data.host_id} created room: ${sessionID}`);
      socket.join(sessionID);

      socket.emit(EVENTS.SERVER.JOIN_SESSION, {
        sessionID: sessionID,
      });

      if (CONFIG.DEBUG) {
        console.log(
          `SessionID (${sessionID}) emitted to ${EVENTS.SERVER.JOIN_SESSION}`
        );
      }
    });

    socket.on(EVENTS.CLIENT.JOIN_SESSION, async (data) => {
      console.log(`${data.username} joined ${data.sessionID}`);
      socket.data.username = data.username;
      socket.join(data.sessionID);
      socket.data.session = data.sessionID;

      socket.emit(EVENTS.SERVER.JOIN_SESSION, {
        sessionID: data.sessionID,
      });
    });

    socket.on(EVENTS.CLIENT.CHECK_IF_HOST, async (data) => {
      const isHost = hostIDs[data.sessionID] === data.userID;
    
      if (DEBUG) {
        console.log(`Checking if user ${data.userID} is host of session ${data.sessionID}`);
        console.log(hostIDs[data.sessionID] + "(backend) | " + data.userID + " (input) =>" + isHost)
      }

      socket.emit(EVENTS.SERVER.CHECK_IF_HOST, {
        isHost: isHost,
      });
    });

    socket.on(EVENTS.CLIENT.LEAVE_SESSION, async (data) => {
      console.log(`User ${socket.id} left session ${data.sessionID}`);
      socket.leave(data.sessionID);

      socket.emit(EVENTS.SERVER.LEAVE_SESSION, data);
    });
  });
});
