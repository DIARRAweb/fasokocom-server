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
  });

  // 📞 appel groupe
  socket.on("call", () => {
    socket.broadcast.emit("incoming");
  });

  // 🔥 OFFER (avec from)
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", {
      offer: data.offer,
      from: socket.id
    });
  });

  // 🔥 ANSWER (avec from)
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