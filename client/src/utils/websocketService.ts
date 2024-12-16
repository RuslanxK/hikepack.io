import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

const SOCKET_URL = process.env.REACT_APP_API || "http://localhost:4000";
let socket: Socket | null = null;

// Function to establish or return the existing WebSocket connection
export const getSocket = (): Socket => {
  if (!socket) {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No auth token found in cookies. WebSocket cannot connect.");
    }

    socket = io(SOCKET_URL, {
      auth: { token }, // Pass the token here
      transports: ["websocket"], // Ensure WebSocket transport
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

// Function to disconnect and clean up the WebSocket connection
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect(); // Disconnect the WebSocket
    socket = null; // Reset the socket variable
    console.log("WebSocket disconnected and reset.");
  }
};
