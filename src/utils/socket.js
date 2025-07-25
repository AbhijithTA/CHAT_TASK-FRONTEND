import { io } from "socket.io-client";

let socket;

export const initSocket = (token) => {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
  socket = io(SOCKET_URL, {
    auth: {
      token,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    },
  });

   socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket.id);
  });

  return socket;
};

export const getSocket = () => socket;
