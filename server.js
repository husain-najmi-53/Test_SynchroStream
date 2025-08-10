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

  io.on('connection', (socket) => {
  socket.on('join-session', ({ sessionId }) => {
    const clientsInRoom = io.sockets.adapter.rooms.get(sessionId);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;

    socket.join(sessionId);

    let role = numClients === 1 ? 'host' : 'guest';
    socket.emit('role', { role });

    // Inform others that a peer is ready
    socket.to(sessionId).emit('peer-ready');
  });
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
