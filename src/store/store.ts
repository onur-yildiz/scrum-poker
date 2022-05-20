import { configureStore } from "@reduxjs/toolkit";
import scrumReducer from "./scrumSlice";

const store = configureStore({
  reducer: {
    scrum: scrumReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
