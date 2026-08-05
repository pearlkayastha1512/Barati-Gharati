import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../constants/api";

const SOCKET_URL = BASE_URL.replace(/\/api\/v1\/?$/, "");

class SocketService {
  socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });
    }

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new SocketService();