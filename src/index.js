require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on("sendMessage", ({ chatId, message }) => {
    console.log(`Message received in chat ${chatId}: ${message}`);
    io.to(chatId).emit("receiveMessage", message);
  });

  socket.on("leaveChat", (chatId) => {
    socket.leave(chatId);
    console.log(`User ${socket.id} left chat ${chatId}\n`);
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}\n`);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});