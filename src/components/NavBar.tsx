import { useAppDispatch, useAppSelector } from "../hooks";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AppBar from "@mui/material/AppBar/AppBar";
import { Button } from "@mui/material";
import ExitToApp from "@mui/icons-material/ExitToApp";
import HubContext from "../store/hubContext";
import IconButton from "@mui/material/IconButton";
import Notification from "./Notification";
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
  const [value, setValue] = useState("0");
  const [notification, setNotification] = useState<{
    message: string;
    open: boolean;
  }>({ open: false, message: "" });

  useEffect(() => {
    const paths = [roomId, "issues", "settings"];
    const path = location.pathname.split("/").reverse()[0];
    const index = paths.indexOf(path);
    setValue(index.toString());
  }, [location.pathname, roomId]);

  const handleSignOut = () => {
    dispatch(leaveRoom(hub.connection));
    navigate("/");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setNotification({
      message: "Copied to clipboard",
      open: true,
    });
  };

  return (
    <AppBar
      id="navbar"
      position="static"
      elevation={0}
      variant="outlined"
      color="default"
      sx={{ zIndex: 9999 }}
    >
      <Toolbar variant="dense">
        <Tabs value={value} selectionFollowsFocus sx={{ flexGrow: 1 }}>
          <Tab value="0" label="Scrum" onClick={() => navigate("")} />
          <Tab value="1" label="Issues" onClick={() => navigate("issues")} />
          <Tab
            value="2"
            label="Settings"
            onClick={() => navigate("settings")}
          />
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
      <Notification
        message={notification.message}
        severity="success"
        open={notification.open}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </AppBar>
  );
};

export default NavBar;
