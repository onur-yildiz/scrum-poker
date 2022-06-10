import { BaseSyntheticEvent, FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CardValuesPresetList from "./CardValuesPresetList";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HubContext from "../store/hubContext";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField/TextField";
import { setScoreList } from "../store/scrumSlice";

const presets = [
  [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
  [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100],
  [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
];

const CardValuesForm = () => {
  const hub = useContext(HubContext);
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
    dispatch(setScoreList({ value: cardValues, connection: hub.connection }));
    setIsSubmitted(true);
  };

  const handlePresetSelection = (set: number[]) => {
    dispatch(setScoreList({ value: set, connection: hub.connection }));
    setScoreListInput(set.join(", "));
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

  const savedSetsString = window.localStorage.getItem("cardSetStorage");
  const savedSets = (
    savedSetsString ? JSON.parse(savedSetsString) : { sets: [] }
  ) as CardSetStorage;

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
      <CardValuesPresetList
        title="Presets"
        onClick={handlePresetSelection}
        presets={presets}
      />
      {savedSets.sets.length > 0 && (
        <CardValuesPresetList
          title="History"
          onClick={handlePresetSelection}
          presets={savedSets.sets}
        />
      )}
    </Box>
  );
};

export default CardValuesForm;
