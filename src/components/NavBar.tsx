import { useAppDispatch, useAppSelector } from "../hooks";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AppBar from "@mui/material/AppBar/AppBar";
import { Button } from "@mui/material";
import ExitToApp from "@mui/icons-material/ExitToApp";
import HubContext from "../store/hubContext";
import IconButton from "@mui/material/IconButton";
import Tab from "@mui/material/Tab/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar/Toolbar";
import Typography from "@mui/material/Typography/Typography";
import { leaveRoom } from "../store/scrumSlice";

const NavBar = () => {
  const hub = useContext(HubContext);
  const { roomId } = useParams();
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.scrum.user.name);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const paths = [roomId, "issues", "settings"];
    const path = location.pathname.split("/").reverse()[0];
    const index = paths.indexOf(path);
    setValue(index);
  }, [location.pathname, roomId]);

  const handleSignOut = () => {
    dispatch(leaveRoom(hub.connection));
    navigate("/");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <AppBar
      id="navbar"
      position="static"
      elevation={0}
      variant="outlined"
      color="default"
    >
      <Toolbar variant="dense">
        <Tabs value={value} selectionFollowsFocus sx={{ flexGrow: 1 }}>
          <Tab label="Scrum" onClick={() => navigate("")} />
          <Tab label="Issues" onClick={() => navigate("issues")} />
          <Tab label="Settings" onClick={() => navigate("settings")} />
        </Tabs>

        <Button onClick={handleCopy} sx={{ mr: 2 }}>
          copy link
        </Button>
        <Typography sx={{ mr: 2 }} variant="subtitle1">
          {userName}
        </Typography>
        <IconButton
          className="leave-button"
          color="error"
          size="large"
          onClick={handleSignOut}
        >
          <ExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
