import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField/TextField";
import { setName } from "../store/scrumSlice";

const NameChangeForm = () => {
  const currentName = useAppSelector<string>((state) => state.scrum.user.name);
  const [nameInput, setNameInput] = useState<string>(currentName);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setNameInput(e.target.value);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;
    const data = new FormData(e.currentTarget);
    const name = data.get("username")?.toString();
    if (!name || name.length === 0) return;
    dispatch(setName(name.toString()));
    setIsSubmitted(true);
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
        {isSubmitted && <CheckCircle color="success" />}
      </Stack>
    </Box>
  );
};

export default NameChangeForm;
