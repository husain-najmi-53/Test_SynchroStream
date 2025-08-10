const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const activeSessions = {};

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create-party', (data) => {
    const sessionId = data.sessionId;
    if (!activeSessions[sessionId]) {
      activeSessions[sessionId] = { host: socket.id, guest: null, hostSessionId: sessionId };
      socket.join(sessionId);
      console.log(`Session ${sessionId} created by host ${socket.id}`);
      socket.emit('session-created', { sessionId });
    } else {
      socket.emit('error', { message: 'Session ID already exists.' });
    }
  });

  socket.on('join-session', (data) => {
    const sessionId = data.sessionId;
    const session = activeSessions[sessionId];
    if (session && !session.guest) {
      session.guest = socket.id;
      socket.join(sessionId);
      console.log(`Guest ${socket.id} joined session ${sessionId}`);
      socket.emit('session-joined', { sessionId });
      io.to(session.host).emit('guest-joined', { guestId: socket.id });
    } else {
      socket.emit('error', { message: 'Session not found or already full.' });
    }
  });

  socket.on('webrtc-signal', (data) => {
    const { sessionId, ...signalData } = data;
    const session = activeSessions[sessionId];
    if (session) {
      const targetId = socket.id === session.host ? session.guest : session.host;
      if (targetId) {
        io.to(targetId).emit('webrtc-signal', signalData);
      }
    }
  });

  socket.on('control', (data) => {
    const { sessionId, ...controlData } = data;
    const session = activeSessions[sessionId];
    if (session) {
      const guestId = session.guest;
      if (guestId) {
        io.to(guestId).emit('control', controlData);
      }
    }
  });

  socket.on('chat-message', (data) => {
    const { sessionId, sender, text } = data;
    const session = activeSessions[sessionId];
    if (session) {
      io.to(sessionId).emit('chat-message', { sender, text });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    for (const sessionId in activeSessions) {
      const session = activeSessions[sessionId];
      if (session.host === socket.id || session.guest === socket.id) {
        console.log(`Session ${sessionId} ended due to user disconnect.`);
        io.to(sessionId).emit('session-ended', { message: 'The other user has left the session.' });
        delete activeSessions[sessionId];
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
