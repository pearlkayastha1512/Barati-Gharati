import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.29.41:8000";; // change this

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