require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.4:3000", "http://www.nhathien.online", "https://www.nhathien.online"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  },
 path: "/socket.io/"
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("sendMessage", (chatId) => {
    console.log(`Message received in chat ${chatId}`);
    io.to(chatId).emit("receiveMessage");
  });

  socket.on("listenChatRequest", (userId) => {
    console.log(`User with id ${userId} is listening for chat requests`);
    socket.join(userId);
  });

  socket.on("addChat", (userId) => {
    console.log(`Chat request to user ${userId}`);
    io.to(userId).emit("receiveChatRequest");
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}\n`);
  });
});

server.listen(process.env.SOCKET_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SOCKET_PORT}`);
});
