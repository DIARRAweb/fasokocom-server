import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {

  console.log("✅ Connecté :", socket.id);

  // 👤 rejoindre
  socket.on("join", (data) => {
    console.log("👤 Nom :", data.name);

    // notifier les autres
    socket.broadcast.emit("user-joined");
  });

  // 🔥 OFFER (ciblé)
  socket.on("offer", (data) => {
    io.to(data.to).emit("offer", {
      offer: data.offer,
      from: socket.id
    });
  });

  // 🔥 ANSWER (ciblé)
  socket.on("answer", (data) => {
    io.to(data.to).emit("answer", {
      answer: data.answer,
      from: socket.id
    });
  });

  // 🔥 ICE (ciblé)
  socket.on("ice-candidate", (data) => {
    io.to(data.to).emit("ice-candidate", {
      candidate: data.candidate,
      from: socket.id
    });
  });

  // 📞 appel groupe (juste notification)
  socket.on("call-group", () => {
    socket.broadcast.emit("incoming");
  });

  // 📞 appel individuel
  socket.on("call-user", (targetId) => {
    io.to(targetId).emit("incoming");
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