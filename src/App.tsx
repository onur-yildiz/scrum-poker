import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";

import IssuesView from "./components/IssuesView";
import JoinOrCreate from "./components/JoinOrCreate";
import NameSelection from "./components/NameSelection";
import ScrumScreen from "./screens/ScrumScreen";
import ScrumView from "./components/ScrumView";
import SettingsView from "./components/SettingsView";
import SignInScreen from "./screens/SignInScreen";
import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { validate as validateUuid } from "uuid";

function App() {
  const roomId = useAppSelector((state) => state.scrum.room.id);

  useEffect(() => {
    const handleResize = () => {
      const navbarHeight = document.getElementById("navbar")?.clientHeight ?? 0;
      const remainingHeight = window.innerHeight - navbarHeight;
      const vh = remainingHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main id="#app" className="app">
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
    </main>
  );
}

export default App;
