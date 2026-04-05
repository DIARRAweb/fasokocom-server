import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("✅ Connecté :", socket.id);

  socket.on("join", (data) => {
    console.log("👤 Nom :", data.name);
  });

  // 🔥 WebRTC SIMPLE (groupe)
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  // 📞 appel groupe
  socket.on("call-group", () => {
    socket.broadcast.emit("incoming");
  });

  // 📴 raccrocher
  socket.on("hang", () => {
    socket.broadcast.emit("hang");
  });

  socket.on("disconnect", () => {
    console.log("❌ Déconnecté :", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🔥 Serveur démarré sur", PORT);
});