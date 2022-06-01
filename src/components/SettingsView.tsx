import Box from "@mui/material/Box";
import CardValuesForm from "./CardValuesForm";
import ConsensusThresholdForm from "./ConsensusThresholdForm";
import { Fragment } from "react";
import NameChangeForm from "./NameChangeForm";
import { useAppSelector } from "../hooks";

const SettingsView = () => {
  const isOwner = useAppSelector((state) => state.scrum.isOwner);

  return (
    <Box className="scrum-screen-view">
      <NameChangeForm />
      {isOwner && (
        <Fragment>
          <ConsensusThresholdForm />
          <CardValuesForm />
        </Fragment>
      )}
    </Box>
  );
};

export default SettingsView;
