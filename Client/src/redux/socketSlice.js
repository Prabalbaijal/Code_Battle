import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
  },
});

export const { setSocket, disconnectSocket } = socketSlice.actions;

export default socketSlice.reducer;
