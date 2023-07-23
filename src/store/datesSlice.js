import {createSlice} from "@reduxjs/toolkit";
import {dateFormat} from "../constants";

export const getFirstDayOfAWeek = (date) => date.startOf('week').format(dateFormat)
export const datesSlice = createSlice({
  name: "selected",
  initialState: [],
  reducers: {
    addSearchDate: (state, action) => {
      if (action.payload) {
        state.push(getFirstDayOfAWeek(action.payload))
      }
    }
  },
});

export const {addSearchDate} = datesSlice.actions;

export default datesSlice.reducer;
