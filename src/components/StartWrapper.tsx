import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { PropsWithChildren } from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";

const StartWrapper = (props: PropsWithChildren<any>) => {
  const theme = useTheme();
  return (
    <Container
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
      // maxWidth="xs"
    >
      <Box>
        <Typography
          variant="h2"
          display="inline"
          color={theme.palette.secondary.main}
          sx={{ fontWeight: "light" }}
        >
          smart
        </Typography>
        <Typography
          variant="h2"
          display="inline"
          color={theme.palette.primary.main}
        >
          Scrum
        </Typography>
      </Box>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
        sx={{ ml: 2, mr: 5 }}
      />
      {props.children}
    </Container>
  );
};

export default StartWrapper;
