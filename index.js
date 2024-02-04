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

const users = {};

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

    socket.on('new-client', (name) => {
      users[socket.id] = name;
      console.log(`${users[socket.id]} has connected to the server`);
    });

    socket.on('disconnect', () => {
      console.log(`${users[socket.id]} disconnected`);
      delete users[socket.id];
    });

    socket.on('user-joined', (sessionID) => {
      console.log(`${users[socket.id]} joined session ${sessionID}`);
    });

    socket.on('create-session', async () => {
      try {
        // Fetch post request using axios
        const host = users[socket.id]; // Assuming users is a dictionary mapping socket IDs to usernames
        const response = await axios.post(
          'http://localhost:3333/session/create-session',
          { host }
        );

        const { sessionId } = response.data;
        socket.emit('sessionID', sessionId);
        console.log(`${users[socket.id]} created session ${sessionId}`);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    });
  });

  app.use(express.json());
  app.use('/question', questionRoute);
  app.use('/session', sessionRoute);

  server.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}!`);
  });
});
