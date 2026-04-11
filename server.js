import express from "express";
import http from "http";
import { Server } from "socket.io";
import { AccessToken } from "livekit-server-sdk";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// ============================
// 🔐 LIVEKIT CONFIG
// ============================
const LIVEKIT_API_KEY=APIJwBBDzoTUasX;
const LIVEKIT_API_SECRET=Cv79QvwIffUYbbyzTFdUsONY5vQSVJF5qbzfsjsKOWUB;

// ============================
// 🎫 TOKEN LIVEKIT
// ============================
app.get("/token", (req, res) => {
  const room = req.query.room || "faso-room";
  const identity = req.query.user || "agent_" + Math.floor(Math.random() * 1000);

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: identity,
  });

  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
  });

  res.send(at.toJwt());
});

// ============================
// 🔌 SOCKET.IO (optionnel)
// ============================
io.on("connection", (socket) => {
  console.log("✅ Connecté :", socket.id);

  socket.on("join", (data) => {
    console.log("👤 Nom :", data.name);
  });

  socket.on("call", () => {
    socket.broadcast.emit("incoming");
  });

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("hang", () => {
    socket.broadcast.emit("hang");
  });

  socket.on("disconnect", () => {
    console.log("❌ Déconnecté :", socket.id);
  });
});

// ============================
// 🚀 SERVER START
// ============================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🔥 Serveur démarré sur", PORT);
});