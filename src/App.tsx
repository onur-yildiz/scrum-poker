import "./App.css";

import {
  Box,
  CssBaseline,
  IconButton,
  SxProps,
  Theme,
  ThemeProvider,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";

import IssuesView from "./components/IssuesView";
import JoinOrCreate from "./components/JoinOrCreate";
import NameSelection from "./components/NameSelection";
import ScrumScreen from "./screens/ScrumScreen";
import ScrumView from "./components/ScrumView";
import SettingsView from "./components/SettingsView";
import SignInScreen from "./screens/SignInScreen";
import darkTheme from "./themes/dark";
import lightTheme from "./themes/light";
import { setTheme } from "./store/appSettingsSlice";
import { useEffect } from "react";
import { validate as validateUuid } from "uuid";

function App() {
  const navbar = document.getElementById("navbar");
  const [roomId, theme] = useAppSelector((state) => [
    state.scrum.room.id,
    state.appSettings.theme,
  ]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      const navbarHeight = navbar?.clientHeight ?? 0;
      const remainingHeight = window.innerHeight - navbarHeight;
      const vh = remainingHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navbar]);

  return (
    <Box
      component="main"
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />
        <IconButton
          sx={themeButtonSx}
          onClick={() =>
            dispatch(setTheme(theme === "dark" ? "light" : "dark"))
          }
        >
          {theme === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>

        <Routes>
          <Route path="/" element={<SignInScreen />}>
            <Route
              index
              element={
                window.localStorage.getItem("username") == null ? (
                  <NameSelection />
                ) : (
                  <Navigate to={"/joinorcreate"} replace={true} />
                )
              }
            />
            <Route path="joinorcreate">
              <Route index element={<JoinOrCreate />} />
              <Route path=":roomId" element={<JoinOrCreate />} />
            </Route>
          </Route>
          <Route path="/:roomId" element={<ScrumScreen />}>
            <Route index element={<ScrumView />} />
            <Route path="issues" element={<IssuesView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={validateUuid(roomId) ? `/${roomId}` : "/"}
                replace={true}
              />
            }
          />
        </Routes>
      </ThemeProvider>
    </Box>
  );
}

const themeButtonSx: SxProps<Theme> = {
  position: "fixed",
  bottom: (theme) => theme.spacing(1),
  right: (theme) => theme.spacing(1),
  zIndex: 9999999999,
};

export default App;
