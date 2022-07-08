import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useContext, useEffect } from "react";

import ExitToApp from "@mui/icons-material/ExitToApp";
import HubContext from "../store/hubContext";
import MemberList from "../components/MemberList";
import NavBar from "../components/NavBar";
import Resizable from "../components/Resizable";
import { leaveRoom } from "../store/scrumSlice";
import { validate as validateUuid } from "uuid";

const ScrumScreen = () => {
  const hub = useContext(HubContext);
  const { roomId } = useParams();
  const loadedRoomId = useAppSelector((state) => state.scrum.room.id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(leaveRoom(hub.connection));
    navigate("/");
  };

  useEffect(() => {
    // if roomId is not a valid UUID, redirect to home
    if (!roomId || !validateUuid(roomId)) return navigate("/");
    // if roomId is valid and different from the loaded roomId, navigate to join screen
    else if (loadedRoomId !== roomId) {
      dispatch(leaveRoom(hub.connection)); // in case of user already being in a room, leave it
      return navigate(`/joinorcreate/${roomId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: 99999999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
        open={!hub.isConnected}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>
          Connection lost. Trying to reconnect...
        </Typography>
        <IconButton color="error" size="large" onClick={handleSignOut}>
          <ExitToApp />
        </IconButton>
      </Backdrop>
      <NavBar />
      <Resizable className="scrum-screen-layout">
        <MemberList />
        <Outlet />
      </Resizable>
    </Box>
  );
};

export default ScrumScreen;
