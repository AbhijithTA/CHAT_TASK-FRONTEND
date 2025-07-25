import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  users: [],
  onlineUsers: [],
  conversations: [],
  currentConversation: null,
  messages: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { getState, dispatch }) => {
    const { token } = getState().auth;
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // extracting the online users from the response
    const onlineUsers = response.data
      .filter((user) => user.isOnline)
      .map((user) => user._id);
    dispatch(setOnlineUsers(onlineUsers));

    return response.data;
  }
);

//  fetching  conversationss
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { getState }) => {
    const { token } = getState().auth;
    const response = await api.get("/api/conversations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (userId, { getState }) => {
    const { token } = getState().auth;
    const response = await api.post(
      "/conversations",
      { userId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
      console.log("API Response in createConversation thunk:", response.data);
    return response.data;
  }
);

// fetching the  messages
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (conversationId, { getState }) => {
    const { token } = getState().auth;
    const response = await api.get(`/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = Array.isArray(response.data.messages)
      ? response.data.messages
      : [];

    return { conversationId, messages };
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload
      );
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetChatState: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const newConversation = action.payload.conversation;
        const exists = state.conversations.find(
          (conv) => conv._id === newConversation._id
        );
        if (!exists) {
          state.conversations.push(newConversation);
        }
      });
  },
});

export const {
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setCurrentConversation,
  addMessage,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectAllUsers = (state) => state.chat.users;
export const selectOnlineUsers = (state) => state.chat.onlineUsers;
export const selectConversations = (state) => state.chat.conversations;
export const selectCurrentConversation = (state) =>
  state.chat.currentConversation;
export const selectMessages = (state) => state.chat.messages;
export const selectChatStatus = (state) => state.chat.status;
export const selectChatError = (state) => state.chat.error;
