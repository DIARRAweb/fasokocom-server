import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("✅ Un utilisateur est connecté :", socket.id);

  socket.on("join", (data) => {
    console.log("👤 Nom reçu :", data.name);
    socket.broadcast.emit("user-joined");
  });

  // 🔁 WebRTC
  socket.on("offer", (data) => {
  io.to(data.to).emit("offer", {
    offer: data.offer,
    from: socket.id
  });
});

  socket.on("answer", (data) => {
  io.to(data.to).emit("answer", {
    answer: data.answer
  });
});

  socket.on("ice-candidate", (data) => {
  io.to(data.to).emit("ice-candidate", {
    candidate: data.candidate
  });
});

  // 📞 APPEL GROUPE
  socket.on("call-group", () => {
    socket.broadcast.emit("incoming");
  });

  // 📞 APPEL INDIVIDUEL
  socket.on("call-user", (targetId) => {
    io.to(targetId).emit("incoming");
  });

  // ❌ RACCROCHER
  socket.on("hang", () => {
    socket.broadcast.emit("hang");
  });

  socket.on("disconnect", () => {
    console.log("❌ Un utilisateur s'est déconnecté :", socket.id);
  });
});

// 🚀 LANCER SERVEUR
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("🔥 Serveur démarré sur le port", PORT);
});
// update