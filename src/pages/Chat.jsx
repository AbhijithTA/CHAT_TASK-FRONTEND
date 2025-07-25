import { useSelector, useDispatch } from "react-redux";
import ChatWindow from "../components/ChatWindow";
import { useEffect } from "react";
import { initSocket } from "../utils/socket";
import { addOnlineUser, removeOnlineUser, setOnlineUsers } from "../features/chat/chatSlice";
import Sidebar from "../components/Sidebar";

function Chat() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = initSocket(token);
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('user_online', (data) => {
      dispatch(addOnlineUser(data.userId));
    });

    socket.on('user_offline', (data) => {
      dispatch(removeOnlineUser(data.userId));
    });

    return () => {
      socket.off('user_online');
      socket.off('user_offline');
      socket.disconnect();
    };
  }, [token, dispatch]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Chat;