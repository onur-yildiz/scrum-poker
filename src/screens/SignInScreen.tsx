import { Outlet } from "react-router-dom";
import Stack from "@mui/material/Stack/Stack";

const SignInScreen = () => {
  return (
    <Stack spacing={2} className="full-width flex-start">
      <Outlet />
    </Stack>
  );
};

export default SignInScreen;
