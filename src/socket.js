// src/socket.js
// Socket.io client initialization is currently disabled
// Uncomment and configure this if you set up WebSocket support in your backend
/*
import { io } from "socket.io-client";

// Use your Flask backend URL
const socket = io("http://127.0.0.1:5000", {
  transports: ["websocket"], // Use WebSocket directly
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Socket disconnected");
});

export default socket;
*/

export const socket = null;
