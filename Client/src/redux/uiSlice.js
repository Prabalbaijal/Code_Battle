import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    challenges: [], // Array of { roomName, initiator }
    inContest: false,
    creatingRoom: false,
    waitingMessage: '',
    requestSentModal: false,
  },
  reducers: {
    addChallenge: (state, action) => {
      state.challenges.push(action.payload);
    },
    removeChallenge: (state, action) => {
        const { roomName, initiator } = action.payload;
      
        if (roomName) {
          state.challenges = state.challenges.filter(
            (c) => c.roomName !== roomName
          );
        } else if (initiator) {
          state.challenges = state.challenges.filter(
            (c) => c.initiator !== initiator
          );
        }
      },
      
    clearChallenges: (state) => {
      state.challenges = [];
    },
    setInContest: (state, action) => {
      state.inContest = action.payload;
    },
    setCreatingRoom: (state, action) => {
      state.creatingRoom = action.payload;
    },
    setWaitingMessage: (state, action) => {
      state.waitingMessage = action.payload;
    },
    setRequestSentModal: (state, action) => {
        state.requestSentModal = action.payload;
      },
  },
});

export const {
  addChallenge,
  removeChallenge,
  clearChallenges,
  setInContest,
  setCreatingRoom,
  setWaitingMessage,
  setRequestSentModal
} = uiSlice.actions;
export default uiSlice.reducer;
