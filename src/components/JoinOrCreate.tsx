import { FormEvent, useContext } from "react";
import { createRoom, joinRoom } from "../store/scrumSlice";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CircularProgress from "@mui/material/CircularProgress";
import HubContext from "../store/hubContext";
import NameChangeFormInline from "./NameChangeFormInline";
import Stack from "@mui/material/Stack";
import StartWrapper from "./StartWrapper";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography/Typography";
import { useAppDispatch } from "../hooks";
import { useTheme } from "@mui/system";
import { v5 } from "uuid";

const JoinOrCreate = () => {
  const hub = useContext(HubContext);
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newRoomId = data.get("room-id")?.toString();
    newRoomId &&
      dispatch(joinRoom({ value: newRoomId, connection: hub.connection }));
  };

  const handleCreate = () => {
    const newRoomId = v5(Date.now().toString(), v5.DNS).toString();
    dispatch(createRoom({ value: newRoomId, connection: hub.connection }));
    navigate(`/${newRoomId}`);
  };

  const disabled = !hub.isConnected;
  return (
    <StartWrapper>
      <Stack sx={{ width: "300px" }}>
        <NameChangeFormInline disabled={disabled} />
        <Box component="form" onSubmit={handleJoin}>
          <TextField
            margin="normal"
            fullWidth
            id="room-id"
            label="Room ID"
            name="room-id"
            autoComplete="room-id"
            autoFocus
            defaultValue={roomId}
            disabled={disabled}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={disabled}
          >
            Join
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          {disabled ? (
            <CircularProgress />
          ) : (
            <Typography variant="h6" color={theme.palette.secondary.main}>
              OR
            </Typography>
          )}
        </Box>
        <Button
          type="submit"
          onClick={handleCreate}
          fullWidth
          variant="contained"
          disabled={disabled}
        >
          Create Room
        </Button>
      </Stack>
    </StartWrapper>
  );
};

export default JoinOrCreate;
