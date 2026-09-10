import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://barati-gharati.onrender.com",
  {
    transports: ["websocket"],
  }
);

// export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//   transports: ["websocket"],
// });