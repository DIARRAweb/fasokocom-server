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

    // prévenir les autres
    socket.broadcast.emit("user-joined");
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

  socket.on("disconnect", () => {
    console.log("❌ Un utilisateur s'est déconnecté :", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});



socket.on("call-group", () => {
socket.broadcast.emit("incoming");
});

socket.on("call-user", (id) => {
io.to(id).emit("incoming");
});

socket.on("hang", () => {
socket.broadcast.emit("hang");
});