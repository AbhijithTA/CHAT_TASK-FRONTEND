import { io } from "socket.io-client";
import { addOnlineUser, removeOnlineUser } from "../features/chat/chatSlice";

let socket = null;

export const initializeSocket = (dispatch, token) => {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
  socket = io(SOCKET_URL, {
    auth: { token },
  });

  socket.on("userOnline", ({ userId }) => {
    dispatch(addOnlineUser(userId));
  });

  socket.on("userOffline", ({ userId }) => {
    dispatch(removeOnlineUser(userId));
  });

  return socket;
};

export const getSocket = () => socket;
