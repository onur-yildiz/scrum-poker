import { BaseSyntheticEvent, FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import HubContext from "../store/hubContext";
import Notification from "./Notification";
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
  const [notification, setNotification] = useState<{
    message: string;
    open: boolean;
  }>({ open: false, message: "" });

  const dispatch = useAppDispatch();

  const isValid = Number(thresholdInput) > 2;
  const isEmpty = thresholdInput.length === 0;

  const handleChange = (e: BaseSyntheticEvent) => {
    setThresholdInput(e.target.value);
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

    setNotification({
      message: "Set auto-assign threshold",
      open: true,
    });
  };

  const handleRemoveConsensusThreshold = () => {
    dispatch(
      setConsensusThreshold({
        value: -1,
        connection: hub.connection,
      })
    );

    setNotification({
      message: "Removed auto-assign threshold",
      open: true,
    });
    setThresholdInput("3");
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
      <Stack direction="row" spacing={2} alignItems="stretch">
        <Button
          variant="contained"
          disableElevation
          type="submit"
          disabled={!isValid}
        >
          set
        </Button>
        {currentThreshold >= 3 && (
          <Button
            disableElevation
            color="error"
            disabled={!isValid}
            onClick={handleRemoveConsensusThreshold}
          >
            remove
          </Button>
        )}
      </Stack>
      <Notification
        message={notification.message}
        severity="success"
        open={notification.open}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default ConsensusThresholdForm;
