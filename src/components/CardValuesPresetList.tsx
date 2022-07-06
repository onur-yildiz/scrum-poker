import { Fragment, PropsWithChildren } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface CardValuesPresetListProps {
  title: string;
  presets: number[][];
  onClick: (value: number[]) => void;
}

const CardValuesPresetList = (
  props: PropsWithChildren<CardValuesPresetListProps>
) => {
  return (
    <Fragment>
      <Typography variant="subtitle2" color="secondary.dark">
        {props.title}
      </Typography>
      <Stack direction="row" spacing={2}>
        {props.presets.map((set, i) => (
          <Button
            key={i}
            variant="outlined"
            color="secondary"
            onClick={() => props.onClick(set)}
          >
            {set.join(", ")}
          </Button>
        ))}
      </Stack>
    </Fragment>
  );
};

export default CardValuesPresetList;
