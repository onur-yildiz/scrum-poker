import { FormEvent, useContext, useState } from "react";
import { createRoom, joinRoom } from "../store/scrumSlice";
import { useNavigate, useParams } from "react-router-dom";
import { v5, validate } from "uuid";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CircularProgress from "@mui/material/CircularProgress";
import HubContext from "../store/hubContext";
import NameChangeFormInline from "./NameChangeFormInline";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import StartWrapper from "./StartWrapper";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography/Typography";
import { useAppDispatch } from "../hooks";
import { useTheme } from "@mui/system";

const JoinOrCreate = () => {
  const hub = useContext(HubContext);
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inputRoomId, setInputRoomId] = useState<string>(roomId ?? "");
  const [open, setOpen] = useState(false);

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputRoomId === "") return;
    if (validate(inputRoomId))
      dispatch(joinRoom({ value: inputRoomId, connection: hub.connection }));
    else setOpen(true);
  };

  const handleCreate = () => {
    const newRoomId = v5(Date.now().toString(), v5.DNS).toString();
    dispatch(createRoom({ value: newRoomId, connection: hub.connection }));
    navigate(`/${newRoomId}`);
  };

  const handleRoomIdChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const regex = /\/([a-z0-9_-]*[/]?)$/;
    let input = event.target.value;
    const parsedValue = regex.exec(input)?.[1];
    if (parsedValue) input = parsedValue;
    setInputRoomId(input);
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
            label="Room ID or URL"
            name="room-id"
            autoComplete="room-id"
            autoFocus
            value={inputRoomId}
            onChange={handleRoomIdChange}
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
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
        >
          <Alert variant="filled" severity="error">
            Invalid Room ID
          </Alert>
        </Snackbar>
      </Stack>
    </StartWrapper>
  );
};

export default JoinOrCreate;
