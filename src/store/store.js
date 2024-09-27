import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "./selectedSlice";
import genresReducer from "./genresSlice";
import datesReducer from "./datesSlice";
import meReducer from "./meSlice";
import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { combineReducers } from "redux";
import playlistNameReducer from "./playlistNameSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["selected"],
};

const reducer = combineReducers({
  selected: selectedReducer,
  genres: genresReducer,
  dates: datesReducer,
  me: meReducer,
  auth: authReducer,
  playlistName: playlistNameReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
