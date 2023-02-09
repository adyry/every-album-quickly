import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    selectTrack: (state, action) => {
      if (action.payload.checked) {
        if (state.findIndex((item) => item === action.payload.uri) === -1) {
          state.push(action.payload.uri);
        }
      } else {
        const index = state.findIndex((item) => item === action.payload.uri);
        if (index !== -1) {
          state.splice(index, 1);
        }
      }
    },
    selectTracks: (state, action) => {
      return action.payload.uris;
    },
    clearTracks: (state, action) => {
      return [];
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectTrack, selectTracks, clearTracks } = selectedSlice.actions;

export default selectedSlice.reducer;
