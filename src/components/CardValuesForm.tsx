import { BaseSyntheticEvent, FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import { CheckCircle } from "@mui/icons-material";
import { Stack } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import { setScoreList } from "../store/scrumSlice";

const CardValuesForm = () => {
  let isValid = true;
  const currentScoreList = useAppSelector((state) =>
    state.scrum.room.scoreList.join(", ")
  );
  const [scoreListInput, setScoreListInput] = useState(currentScoreList);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setScoreListInput(e.target.value);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cardValues = scoreListInput
      .split(",")
      .map((item) => Number(item.trim()));
    dispatch(setScoreList(cardValues));
    setIsSubmitted(true);
  };

  const validateScoreListInput = () => {
    if (scoreListInput.length === 0) {
      isValid = false;
    } else {
      const cardValues = scoreListInput
        .split(",")
        .map((item) => Number(item.trim()));

      isValid = cardValues.every((item) => !isNaN(item));
    }
  };
  validateScoreListInput();

  return (
    <Box component="form" className="card-values-form" onSubmit={handleSubmit}>
      <TextField
        error={!isValid}
        id="card-values"
        label="Card Values"
        value={scoreListInput}
        onChange={handleChange}
        helperText={`Seperate values by comma (ex. 1,2,3,4,5)`}
        variant="outlined"
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          disabled={!isValid}
          variant="contained"
          size="large"
          disableElevation
          type="submit"
        >
          change values
        </Button>
        {isSubmitted && <CheckCircle color="success" />}
      </Stack>
    </Box>
  );
};

export default CardValuesForm;
