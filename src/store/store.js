import {configureStore} from "@reduxjs/toolkit";
import selectedReducer from "./selectedSlice";
import genresReducer from "./genresSlice";
import datesReducer from "./datesSlice";
import storage from "redux-persist/lib/storage";
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE} from "redux-persist";
import {combineReducers} from "redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ['selected']
};

const reducer = combineReducers({
  selected: selectedReducer,
  genres: genresReducer,
  dates: datesReducer
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