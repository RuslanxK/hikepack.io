import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = process.env.REACT_APP_API;
let socket: Socket | null = null;
export const getSocket = (): Socket => {
  if (!socket) {
    const token = Cookies.get("token");
    if (!token) {
      throw new Error("No auth token found in cookies. WebSocket cannot connect.");
    }
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"], 
    });
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });
  }

  return socket;
};
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect(); 
    socket = null; 
    console.log("WebSocket disconnected and reset.");
  }
};
