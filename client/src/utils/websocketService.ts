// websocketService.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  return socket;
};
