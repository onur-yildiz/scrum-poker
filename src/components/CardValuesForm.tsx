import { BaseSyntheticEvent, FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CardValuesPresetList from "./CardValuesPresetList";
import HubContext from "../store/hubContext";
import Notification from "./Notification";
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
  const currentScoreList = useAppSelector(
    (state) => state.scrum.room.scoreList
  );
  const [scoreListInput, setScoreListInput] = useState(
    currentScoreList.join(", ")
  );
  const [notification, setNotification] = useState<{
    message: string;
    open: boolean;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });
  const dispatch = useAppDispatch();

  const handleChange = (e: BaseSyntheticEvent) => {
    setScoreListInput(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cardValues = scoreListInput
      .split(",")
      .map((item) => Number(item.trim()));

    if (currentScoreList.toString() === cardValues.toString()) {
      setNotification({
        message: "These values are already set",
        severity: "info",
        open: true,
      });
      return;
    }

    dispatch(setScoreList({ value: cardValues, connection: hub.connection }));
    setNotification({
      message: "Set new card values",
      severity: "success",
      open: true,
    });
  };

  const handlePresetSelection = (set: number[]) => {
    dispatch(setScoreList({ value: set, connection: hub.connection }));
    setScoreListInput(set.join(", "));
    setNotification({
      message: "Set preset card values",
      severity: "success",
      open: true,
    });
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
      <Button
        disabled={!isValid}
        variant="contained"
        disableElevation
        type="submit"
      >
        change values
      </Button>
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
      <Notification
        message={notification.message}
        severity={notification.severity}
        open={notification.open}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default CardValuesForm;
