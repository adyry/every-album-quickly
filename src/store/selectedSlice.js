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
        state.splice(
          state.findIndex((item) => item === action.payload.uri),
          1
        );
      }
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectTrack } = selectedSlice.actions;

export default selectedSlice.reducer;
