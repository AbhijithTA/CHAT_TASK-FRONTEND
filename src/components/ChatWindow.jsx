import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectMessages,
  selectCurrentConversation,
  addMessage,
  fetchMessages,
} from "../features/chat/chatSlice";
import MessageInput from "./MessageInput";
import { getSocket } from "../services/socket";

function ChatWindow() {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages) || []; // Fallback to empty array
  const currentConversation = useSelector(selectCurrentConversation);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentConversation) {
      dispatch(fetchMessages(currentConversation));
    }
  }, [currentConversation, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      dispatch(addMessage(message));
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [dispatch]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No messages yet</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = user?._id === msg.sender?._id;
            
            return (
              <div
                key={msg._id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-xs md:max-w-md lg:max-w-lg ${
                    isCurrentUser ? "flex-row-reverse" : ""
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">
                        {msg.sender?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        {msg.sender?.username}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isCurrentUser ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        {currentConversation && (
          <MessageInput conversationId={currentConversation} />
        )}
      </div>
    </div>
  );
}

export default ChatWindow;