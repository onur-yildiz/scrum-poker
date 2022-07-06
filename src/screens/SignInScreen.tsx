import { Outlet } from "react-router-dom";
import Stack from "@mui/material/Stack/Stack";

const SignInScreen = () => {
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
      }}
    >
      <Outlet />
    </Stack>
  );
};

export default SignInScreen;
