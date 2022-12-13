import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "./selectedSlice";

export const store = configureStore({
  reducer: {
    selected: selectedReducer,
  },
});
