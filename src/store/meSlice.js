import { createSlice } from "@reduxjs/toolkit";

export const meSlice = createSlice({
  name: "me",
  initialState: {},
  reducers: {
    setMe: (state, action) => {
      return action.payload;
    },
  },
});

export const { setMe } = meSlice.actions;

export default meSlice.reducer;
