import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/api";

// BASE_URL is like "http://192.168.29.41:8000/api/v1" — socket.io needs the root, not the /api/v1 path
const SOCKET_URL = BASE_URL.replace(/\/api\/v1\/?$/, "");

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};