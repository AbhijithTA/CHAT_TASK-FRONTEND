import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../features/chat/chatSlice";
import { getSocket } from "../services/socket"; 

function MessageInput({ conversationId }) {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const socket = getSocket();

  
  useEffect(() => {
    if (!socket) return;

    const handleMessageAck = (savedMessage) => {
      dispatch(addMessage(savedMessage));
    };

    socket.on("message_acknowledged", handleMessageAck);

    return () => {
      socket.off("message_acknowledged", handleMessageAck);
    };
  }, [socket, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;

    const tempMessage = {
      _id: Date.now().toString(),
      conversationId,
      sender: user._id,
      content: message,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    dispatch(addMessage(tempMessage));

    try {
      socket.emit("send_message", {
        conversationId,
        content: message,
      });

      setMessage("");
    } catch (error) {
      console.error("Message send error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-150"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
