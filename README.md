# SynchroStream 🎬✨  
**Watch movies and series together, in sync, with chat & voice support.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![Docker](https://img.shields.io/badge/Docker-ready-blue?logo=docker)](https://www.docker.com/)  
[![GitHub stars](https://img.shields.io/github/stars/husain-najmi-53/Test_SynchroStream?style=social)](https://github.com/husain-najmi-53/Test_SynchroStream/stargazers)  
[![GitHub forks](https://img.shields.io/github/forks/husain-najmi-53/Test_SynchroStream?style=social)](https://github.com/husain-najmi-53/Test_SynchroStream/network/members)  
[![GitHub issues](https://img.shields.io/github/issues/husain-najmi-53/Test_SynchroStream)](https://github.com/husain-najmi-53/Test_SynchroStream/issues)  

---

## 🚀 Features  
- 🎥 **Synchronized video playback** (play, pause, seek synced across users).  
- 🗣️ **Built-in voice chat** with mute/unmute toggle.  
- 💬 **Live chat** with styled message bubbles and timestamps.  
- 🔑 **Unique Session IDs** for private rooms.  
- 🎛️ **Host & Guest roles**.  
- 📱 **Responsive UI** with TailwindCSS.  
- ☁️ **Dockerized deployment** for easy hosting.  

---

## 🛠️ Tech Stack  
- **Backend**: Node.js + Express  
- **Real-time Communication**: Socket.IO  
- **Peer-to-Peer Streaming**: WebRTC  
- **Frontend**: Vanilla JS + TailwindCSS  
- **Deployment**: Docker  

---

## 📂 Project Structure  
```

Test\_SynchroStream/
├── server.js         # Express + Socket.IO signaling server
├── index.html        # Frontend (lobby, watch party UI, chat, controls)
├── Dockerfile        # Containerized deployment setup
├── package.json      # Node.js dependencies & scripts
└── ...               # Other assets/configs

````

---

## ⚡ Getting Started  

### 1. Clone the repository  
```bash
git clone https://github.com/husain-najmi-53/Test_SynchroStream.git
cd Test_SynchroStream
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The app runs on **[http://localhost:3000](http://localhost:3000)**

---

## 🐳 Run with Docker

Build and run the app in a container:

```bash
docker build -t synchrostream .
docker run -p 3000:3000 synchrostream
```

---

## 🎮 Usage

1. Open the app in your browser.
2. Click **Create Watch Party** (you’ll become the host).

   * Upload a video file.
   * Share the **Session ID** with a friend.
3. A friend clicks **Join Party** and enters the Session ID.
4. Both users can:

   * Watch the same video **in sync**.
   * **Chat live**.
   * **Talk via microphone**.

---

## 🔐 Notes

* For production, update CORS in `server.js` to restrict origins.
* Works best in **Chrome/Firefox** with `captureStream()` support.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss your ideas.

---

## 📜 License

MIT License © 2025 [Husain Najmi](https://github.com/husain-najmi-53)

