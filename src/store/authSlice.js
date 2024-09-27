import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: null,
  reducers: {
    setAuth: (state, action) => {
      return action.payload;
    },
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
