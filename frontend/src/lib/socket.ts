import { io } from "socket.io-client";

// export const socket = io(
//   "http://localhost:8000",
//   {
//     transports: ["websocket"],
//   }
// );

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  transports: ["websocket"],
});