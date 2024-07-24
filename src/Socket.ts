import { io } from "socket.io-client";

const localhostIP = 
  "https://vtech-api.onrender.com";
  // "http://localhost:3001";
const URL = localhostIP;
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_error", (err) => {
  if (err.message === "No id given!") {
      console.log("Socket.ts - Please login first");
  }
});

export {socket};