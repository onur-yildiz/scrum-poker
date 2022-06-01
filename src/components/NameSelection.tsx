import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import StartWrapper from "./StartWrapper";
import TextField from "@mui/material/TextField";
import { setName } from "../store/scrumSlice";
import { useNavigate } from "react-router-dom";

const NameSelection = () => {
  const currentName = useAppSelector<string>((state) => state.scrum.user.name);
  const [nameInput, setNameInput] = useState<string>(currentName);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setNameInput(e.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("username")?.toString();
    name && dispatch(setName({ value: name }));
    navigate("joinorcreate");
  };

  return (
    <StartWrapper>
      <Stack sx={{ width: "300px" }} component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          value={nameInput}
          defaultValue={nameInput}
          onChange={handleChange}
          id="username"
          label="Name"
          name="username"
          autoComplete="username"
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={nameInput?.length === 0}
        >
          Next
        </Button>
      </Stack>
    </StartWrapper>
  );
};

export default NameSelection;
