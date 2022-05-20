import "./App.css";

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  designateOwner,
  loadRoom,
  newIssue,
  newMember,
  newScoreList,
  newVote,
  nextRound,
  removeUser,
  revealResult,
  switchIssue,
} from "./store/scrumSlice";
import hub, { HubMethods } from "./hub";
import { useAppDispatch, useAppSelector } from "./hooks";

import IssuesView from "./components/IssuesView";
import JoinOrCreate from "./components/JoinOrCreate";
import NameSelection from "./components/NameSelection";
import ScrumScreen from "./screens/ScrumScreen";
import ScrumView from "./components/ScrumView";
import SettingsView from "./components/SettingsView";
import SignInScreen from "./screens/SignInScreen";
import { useEffect } from "react";
import { validate as validateUuid } from "uuid";

let isListening = false;

function App() {
  const roomId = useAppSelector((state) => state.scrum.room.id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initListerners = () => {
      const conn = hub.connection;
      conn.on(HubMethods.RECEIVE_MEMBER, (user: User) => {
        console.log("New member ", user);
        dispatch(newMember(user));
      });
      conn.on(HubMethods.RECEIVE_ISSUE, (issue: Issue) => {
        console.log("Received issue ", issue);
        dispatch(newIssue({ value: issue }));
      });
      conn.on(HubMethods.RECEIVE_VOTE, (vote: Vote) => {
        console.log("Received vote ", vote);
        dispatch(newVote(vote));
      });
      conn.on(HubMethods.RECEIVE_SCORE_LIST, (scoreList: number[]) => {
        console.log("Received score list ", scoreList);
        dispatch(newScoreList(scoreList));
      });
      conn.on(HubMethods.RECEIVE_ROOM_ACCEPTION, (room: Room) => {
        console.log("Accepted in ", room);
        dispatch(loadRoom(room));
        navigate(`/${room.id}`);
      });
      conn.on(HubMethods.RECEIVE_USER_LEFT, (userId: string) => {
        console.log("User left ", userId);
        dispatch(removeUser(userId));
      });
      conn.on(HubMethods.RECEIVE_RESULT_REVEALED, () => {
        console.log("Result revealed");
        dispatch(revealResult());
      });
      conn.on(HubMethods.RECEIVE_ISSUE_SWITCH, (issueIndex: number) => {
        console.log("Issue switched ", issueIndex);
        dispatch(switchIssue({ value: issueIndex }));
      });
      conn.on(HubMethods.RECEIVE_OWNER_DESIGNATION, (ownerId: string) => {
        console.log("Owner designation");
        dispatch(designateOwner(ownerId));
      });
      conn.on(HubMethods.RECEIVE_NEXT_ROUND, () => {
        console.log("Next round");
        dispatch(nextRound({ value: null }));
      });
      isListening = true;
      console.log("Listening to hub");
    };

    !isListening && initListerners();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
