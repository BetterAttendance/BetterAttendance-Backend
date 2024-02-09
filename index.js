const express = require('express');
const mongoose = require('mongoose');
const questionRoute = require('./routes/question');
const sessionRoute = require('./routes/session');
const cors = require('cors'); // Import the cors package (REQUIRED TO PASS DATA TO CLIENT FROM DATABASE)
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const DEBUG = true;

require('dotenv').config();
// Remember to pull the confidentals (.env) by npx dotenv-vault pull

console.log('Starting BetterAttendance server..');

const hosts = {};             // Store the names of connected hosts (index: socket IDs)
const users = {};             // Store the names of connected clients (index: socket IDs)
const sessionUsersCount = {}; // Store the number of users in each session
const socketSessionMap = {}; // Store the mapping of socket IDs to session IDs


mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }).then(() => {
  console.log('Successfully connected to the database!');
  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  app.use(cors());

  io.on('connection', (socket) => {
    if (DEBUG) {
      console.log('New connection request detected');
    }

    // Inform when the client connects successfully
    if (users[socket.id]) {
      console.log(`${socket.id} connected`);
    }

    socket.on('new-host', (name) => {
      hosts[socket.id] = name;
      console.log(`Host ${hosts[socket.id]} (${socket.id}) has connected to the server`);
    });

    socket.on('new-client', (name) => {
      users[socket.id] = name;
      console.log(`${users[socket.id]} (${socket.id}) has connected to the server`);
    });

    socket.on('disconnect', () => {
      if (DEBUG) {
        console.log('disconnect event triggered');
        console.log('Socket id:' + socket.id);
        console.log('Users list:', users); // Logging the users object
      }

      // Convert socket.id to string for comparison (some cases where socket.id is not a string)
      const socketIdString = String(socket.id);

      // Subtract the user count for the session
      if (socketIdString in users) {
        console.log(`User ${users[socketIdString]} has disconnected from the server`)

        const sessionID = socketSessionMap[socketIdString];  // Get the session ID associated with the disconnected socket
        sessionUsersCount[sessionID]--;
        io.emit('user-left', { username: users[socketIdString], sessionID, count: sessionUsersCount[sessionID] });
        console.log(`${users[socketIdString]} disconnected`);

        delete users[socketIdString];
        delete socketSessionMap[socketIdString];

        if (DEBUG) {
          console.log('sessionUsersCount after:', sessionUsersCount[sessionID]);
          console.log('socketID after:', socketIdString);
        }

      } else if (socketIdString in hosts) {
        console.log(`Host ${hosts[socketIdString]} has disconnected from the server`)
        delete hosts[socketIdString];
      } else {
        // Handle disconnection for other cases
        console.log(`Unknown socket ${socketIdString} has disconnected from the server`);
      }
    });

    socket.on('create-session', async () => {
      try {
        // Fetch post request using axios
        const host = hosts[socket.id]; // Assuming users is a dictionary mapping socket IDs to usernames
        const response = await axios.post(
          'http://localhost:3333/session/create-session',
          { host }
        );

        const { sessionId } = response.data;
        socket.emit('sessionID', sessionId);
        console.log(`${hosts[socket.id]} created session ${sessionId}`);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    });

    socket.on('join-session', async (sessionID) => {  
      try {
          // Validate session ID by making an HTTP GET request to the route
          const response = await axios.get(`http://localhost:3333/session/join/${sessionID}`);
  
          // Check if the response indicates success
          if (response.status === 200) {
              // Session exists, emit success message
              socket.emit('join-session-validate', { success: true });
              console.log(`${users[socket.id]} joined session ${sessionID}`);
  
              // Increase the user count for the session
              if (!sessionUsersCount[sessionID]) {
                  sessionUsersCount[sessionID] = 1;
              } else {
                  sessionUsersCount[sessionID]++;
              }
  
              // Store the mapping of socket ID to session ID
              socketSessionMap[socket.id] = sessionID;
  
              // Emit 'user-joined' event to inform clients
              io.emit('user-joined', { username: users[socket.id], sessionID, count: sessionUsersCount[sessionID] });
              console.log('user-joined emitted');
          } else {
              // Session does not exist, emit failure message
              socket.emit('join-session-validate', { success: false });
          }
      } catch (error) {
          console.error('Error validating session ID:', error);
          // Inform the client about the error
          socket.emit('join-session-validate', { success: false });
      }
  });
  

    socket.on('fetch-num-users', (sessionID) => {
      console.log('fetch-num-users triggered');
      socket.emit('num-users', { count: sessionUsersCount[sessionID] });
    });
  });

  app.use(express.json());
  app.use('/question', questionRoute);
  app.use('/session', sessionRoute);

  server.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}!`);
  });
});
