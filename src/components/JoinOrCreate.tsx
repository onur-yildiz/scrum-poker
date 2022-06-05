import { createRoom, joinRoom } from "../store/scrumSlice";
import { useAppDispatch } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import { FormEvent } from "react";
import NameChangeFormInline from "./NameChangeFormInline";
import Stack from "@mui/material/Stack";
import StartWrapper from "./StartWrapper";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography/Typography";
import { useTheme } from "@mui/system";
import { v5 } from "uuid";

const JoinOrCreate = () => {
  const { roomId } = useParams();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newRoomId = data.get("room-id")?.toString();
    if (!newRoomId) return;

    roomId && dispatch(joinRoom(newRoomId));
  };

  const handleCreate = () => {
    const newRoomId = v5(Date.now().toString(), v5.DNS).toString();
    dispatch(createRoom(newRoomId));
    navigate(`/${newRoomId}`);
  };

  return (
    <StartWrapper>
      <Stack sx={{ width: "300px" }}>
        <NameChangeFormInline />
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
          />
          <Button type="submit" fullWidth variant="contained">
            Join
          </Button>
        </Box>
        <Typography
          sx={{ mt: 2, mb: 2 }}
          variant="h6"
          color={theme.palette.secondary.main}
        >
          OR
        </Typography>
        <Button
          type="submit"
          onClick={handleCreate}
          fullWidth
          variant="contained"
        >
          Create Room
        </Button>
      </Stack>
    </StartWrapper>
  );
};

export default JoinOrCreate;
