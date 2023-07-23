import {createSlice} from "@reduxjs/toolkit";
import {myGenres} from "../constants";

const initialState = myGenres;

export const genresSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    changeGenres: (state, action) => {

      if (action.payload) {
        return action.payload
      }
    }
  },
});

export const {changeGenres} = genresSlice.actions;

export default genresSlice.reducer;
