import { BaseSyntheticEvent, FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HubContext from "../store/hubContext";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField/TextField";
import { setConsensusThreshold } from "../store/scrumSlice";

const ConsensusThresholdForm = () => {
  const hub = useContext(HubContext);
  const currentThreshold = useAppSelector(
    (state) => state.scrum.room.consensusThreshold
  );
  const [thresholdInput, setThresholdInput] = useState(
    currentThreshold === -1 ? "3" : currentThreshold.toString()
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useAppDispatch();

  const isValid = Number(thresholdInput) > 2;
  const isEmpty = thresholdInput.length === 0;

  const handleChange = (e: BaseSyntheticEvent) => {
    setThresholdInput(e.target.value);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEmpty) return;
    dispatch(
      setConsensusThreshold({
        value: Number(thresholdInput),
        connection: hub.connection,
      })
    );
    setIsSubmitted(true);
  };

  return (
    <Box component="form" className="card-values-form" onSubmit={handleSubmit}>
      <TextField
        error={!isValid}
        id="auto-assign-form"
        label="Auto-assign Threshold"
        name="auto-assign-threshold"
        value={thresholdInput}
        onChange={handleChange}
        variant="outlined"
        helperText={!isValid ? "Value must be greater than 2" : ""}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          size="large"
          disableElevation
          type="submit"
          disabled={!isValid}
        >
          set
        </Button>
        {isSubmitted && <CheckCircle color="success" />}
      </Stack>
    </Box>
  );
};

export default ConsensusThresholdForm;
