import { createSlice } from "@reduxjs/toolkit";

export const playlistNameSlice = createSlice({
  name: "playlistName",
  initialState: `Discovered ${new Date().toDateString()}`,
  reducers: {
    changeName: (state, action) => {
      if (action.payload) {
        return action.payload;
      }
    },
  },
});

export const { changeName } = playlistNameSlice.actions;

export default playlistNameSlice.reducer;
