import { BaseSyntheticEvent, FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import HubContext from "../store/hubContext";
import Notification from "./Notification";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField/TextField";
import { setName } from "../store/scrumSlice";

const NameChangeForm = () => {
  const hub = useContext(HubContext);
  const currentName = useAppSelector<string>((state) => state.scrum.user.name);
  const [nameInput, setNameInput] = useState<string>(currentName);
  const [notification, setNotification] = useState<{
    message: string;
    open: boolean;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setNameInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentName === nameInput) {
      setNotification({
        message: "You already have this name",
        severity: "info",
        open: true,
      });
      return;
    }

    dispatch(setName({ value: nameInput, connection: hub.connection }));

    setNotification({
      message: "Changed name",
      severity: "success",
      open: true,
    });
  };

  const isEmpty = nameInput?.length === 0;

  return (
    <Box component="form" className="card-values-form" onSubmit={handleSubmit}>
      <TextField
        id="change-username"
        label="Change Name"
        name="username"
        value={nameInput}
        onChange={handleChange}
        variant="outlined"
        helperText={isEmpty ? "Name cannot be empty" : ""}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          size="large"
          disableElevation
          type="submit"
          disabled={isEmpty}
        >
          change name
        </Button>
      </Stack>
      <Notification
        message={notification.message}
        severity={notification.severity}
        open={notification.open}
        onClose={() => {
          setNotification((prev) => ({ ...prev, open: false }));
        }}
      />
    </Box>
  );
};

export default NameChangeForm;
