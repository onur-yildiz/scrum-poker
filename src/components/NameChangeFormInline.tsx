import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { Check, Edit } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography";
import { setName } from "../store/scrumSlice";

const NameChangeFormInline = () => {
  const currentName = useAppSelector((state) => state.scrum.user.name);
  const [nameInput, setNameInput] = useState(currentName);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setNameInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;
    dispatch(setName({ value: nameInput }));
    setIsEditing(false);
  };

  const isEmpty = nameInput?.length === 0;

  return (
    <Box>
      {isEditing ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            value={nameInput}
            onChange={handleChange}
            size="small"
            variant="standard"
            fullWidth
            inputProps={{ "aria-label": "name change" }}
          />
          <IconButton type="submit" aria-label="change">
            <Check />
          </IconButton>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="primary">
            {currentName}
          </Typography>
          <IconButton onClick={() => setIsEditing(true)} size="small">
            <Edit />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};

export default NameChangeFormInline;
