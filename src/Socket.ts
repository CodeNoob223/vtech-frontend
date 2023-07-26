import { io } from "socket.io-client";

const localhostIP = "192.168.0.102";
const URL = `http://${localhostIP}:3001`;
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