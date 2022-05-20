import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";

import { Box } from "@mui/material";
import MemberList from "../components/MemberList";
import NavBar from "../components/NavBar";
import Resizable from "../components/Resizable";
import { joinRoom } from "../store/scrumSlice";
import { useEffect } from "react";
import { validate as validateUuid } from "uuid";

const MainScreen = () => {
  const { roomId } = useParams();
  const loadedRoomId = useAppSelector((state) => state.scrum.room.id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // if roomId is not a valid UUID, redirect to home
    if (!roomId || !validateUuid(roomId)) navigate("/");
    // if roomId is valid and different from the loaded roomId, leave room and join the new one
    else if (loadedRoomId !== roomId) {
      dispatch(joinRoom(roomId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="full-width" sx={{ height: "100%" }}>
      <NavBar />
      <Resizable className="scrum-screen-layout">
        <MemberList />
        <Outlet />
      </Resizable>
    </Box>
  );
};

export default MainScreen;
