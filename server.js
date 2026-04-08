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

  // 📞 appel groupe (simple)
  socket.on("call", () => {
    socket.broadcast.emit("incoming");
  });

  // 🔥 OFFER (broadcast)
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  // 🔥 ANSWER (broadcast)
  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  // 🔥 ICE (broadcast)
  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
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