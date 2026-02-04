// socketClient.js
import { io } from "socket.io-client";
import { Howl } from "howler";
import depositSoundFile from "../../assets/vendors/Sound/msg.mp3";
import { socketServerURL, socketPath } from "./socketConfig";

const socket = io(socketServerURL, {
  path: socketPath,
  transports: ["polling"],
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: Infinity, // Number of reconnection attempts
  reconnectionDelay: 2000, // Initial delay in milliseconds
  reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
});
// const socket = io("http://localhost:4000");

const depositSound = new Howl({
  src: [depositSoundFile],
  volume: 0.5, // Adjust the volume as needed
});

export { socket, depositSound };
