// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Allow socket.io to work with HTTPS/WSS on Render (default)
const io = new Server(server, {
  cors: {
    origin: "*", // restrict this in production to your domain
    methods: ["GET","POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

const activeSessions = {};

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-session', ({ sessionId }) => {
    if (!sessionId) return;
    socket.join(sessionId);
    // Record host/guest roles simply
    if (!activeSessions[sessionId]) {
      activeSessions[sessionId] = { host: socket.id, guest: null };
      console.log(`Created session ${sessionId} with host ${socket.id}`);
      socket.emit('role', { role: 'host' });
    } else if (!activeSessions[sessionId].guest) {
      activeSessions[sessionId].guest = socket.id;
      socket.emit('role', { role: 'guest' });
      io.to(sessionId).emit('peer-ready', { message: 'Peer joined', sessionId });
      console.log(`Guest ${socket.id} joined session ${sessionId}`);
    } else {
      // session full
      socket.emit('session-full', { message: 'Session already has two participants.' });
    }
  });

  socket.on('webrtc-signal', (data) => {
    if (!data || !data.sessionId) return;
    // forward to everyone in the room except sender
    socket.to(data.sessionId).emit('webrtc-signal', data);
  });

  socket.on('control', (data) => {
    if (!data || !data.sessionId) return;
    socket.to(data.sessionId).emit('control', data);
  });

  socket.on('chat-message', (data) => {
    if (!data || !data.sessionId) return;
    io.to(data.sessionId).emit('chat-message', data); // broadcast to room including sender
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    // cleanup any activeSessions entries for this socket
    for (const sessionId in activeSessions) {
      const session = activeSessions[sessionId];
      if (session.host === socket.id || session.guest === socket.id) {
        io.to(sessionId).emit('session-ended', { message: 'The other user has left the session.' });
        delete activeSessions[sessionId];
        console.log(`Session ${sessionId} removed`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
