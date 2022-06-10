import appSettingsReducer from "./appSettingsSlice";
import { configureStore } from "@reduxjs/toolkit";
import scrumReducer from "./scrumSlice";

const store = configureStore({
  reducer: {
    scrum: scrumReducer,
    appSettings: appSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
