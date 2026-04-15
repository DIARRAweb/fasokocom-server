import express from "express";
import http from "http";
import { Server } from "socket.io";
import { AccessToken } from "livekit-server-sdk";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

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
// 📍 POSITION TEMPS RÉEL
// ============================
let agentsPositions = {};

io.on("connection", (socket) => {
  console.log("🟢 Agent connecté :", socket.id);

  // 📍 POSITION
  socket.on("updatePosition", (data) => {
    console.log("📥 POSITION REÇUE :", data);

    agentsPositions[data.name] = {
      ...data,
      socketId: socket.id
    };

    io.emit("positionsUpdate", agentsPositions);
  });

  // 📡 ITINÉRAIRE DU COMMANDEMENT
  socket.on("sendRoute", (data) => {
    console.log("📡 ITINÉRAIRE REÇU DU COMMANDEMENT :", data);

    io.emit("receiveRoute", data);
  });

  // 🔴 DÉCONNEXION
  socket.on("disconnect", () => {
    for (let key in agentsPositions) {
      if (agentsPositions[key].socketId === socket.id) {
        delete agentsPositions[key];
      }
    }

    io.emit("positionsUpdate", agentsPositions);
    console.log("🔴 Agent déconnecté :", socket.id);
  });
});

// ============================
// 🚀 SERVER START
// ============================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🔥 Serveur démarré sur", PORT);
});