import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllUsers,
  selectOnlineUsers,
  setCurrentConversation,
  fetchUsers,
  createConversation,
  fetchMessages,
} from "../features/chat/chatSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

import { initializeSocket } from "../services/socket";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectAllUsers);
  const onlineUsers = useSelector(selectOnlineUsers);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleUserClick = async (userId) => {
    try {
      const { conversation } = await dispatch(
        createConversation(userId)
      ).unwrap();
      const conversationId = conversation._id;

      dispatch(setCurrentConversation(conversationId));
      dispatch(fetchMessages(conversationId));
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchUsers());

    initializeSocket(dispatch, token);
  }, [dispatch, token]);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
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
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <p className="text-xs text-gray-500">{users.length} users</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Online Users
          </h3>
          <div className="space-y-1">
            {users
              .filter((u) => u._id !== user?._id)
              .map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleUserClick(u._id)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition duration-150"
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {u.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        onlineUsers.includes(u._id)
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {u.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.userName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.userName}
              </p>
              <p className="text-xs text-green-500">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 transition duration-150"
            title="Logout"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
