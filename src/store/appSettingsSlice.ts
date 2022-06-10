import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ThemeOption = "light" | "dark";
interface AppSettingsState {
  theme: "light" | "dark";
}

const initialState: AppSettingsState = {
  theme: (window.localStorage.getItem("theme") as ThemeOption) ?? "light",
};

const appSettingsSlice = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeOption>) {
      state.theme = action.payload;
      window.localStorage.setItem("theme", state.theme);
    },
  },
});

export const { setTheme } = appSettingsSlice.actions;

export default appSettingsSlice.reducer;
