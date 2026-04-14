import express from "express";
import http from "http";
import { Server } from "socket.io";
import { AccessToken } from "livekit-server-sdk";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.static("public"));

// ============================
// 🔐 LIVEKIT CONFIG
// ============================
const LIVEKIT_API_KEY = "APIJwBBDzoTUasX";
const LIVEKIT_API_SECRET = "Cv79QvwIffUYbbyzTFdUsONY5vQSVJF5qbzfsjsKOWUB";

// ============================
// 🎫 TOKEN LIVEKIT
// ============================
app.get("/getToken", (req, res) => {
  try {
    const room = req.query.room || "faso";
    const identity = req.query.name || "agent_" + Math.floor(Math.random() * 1000);

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: identity,
    });

    at.addGrant({
      roomJoin: true,
      room: room,
      canPublish: true,
      canSubscribe: true,
    });

    res.json({ token: at.toJwt() });

  } catch (err) {
    console.error("❌ Erreur token :", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================
// 🔌 SOCKET.IO
// ============================
io.on("connection", (socket) => {
  console.log("✅ Connecté :", socket.id);

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