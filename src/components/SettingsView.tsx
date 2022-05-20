import Box from "@mui/material/Box";
import CardValuesForm from "./CardValuesForm";
import NameChangeForm from "./NameChangeForm";
import { useAppSelector } from "../hooks";

const SettingsView = () => {
  const isOwner = useAppSelector((state) => state.scrum.isOwner);

  return (
    <Box className="scrum-screen-view">
      <NameChangeForm />
      {isOwner && <CardValuesForm />}
    </Box>
  );
};

export default SettingsView;
