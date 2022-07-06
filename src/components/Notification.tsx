import Alert, { AlertColor } from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";

import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";

interface NotificationProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  severity?: AlertColor;
  variant?: "filled" | "standard" | "outlined";
  autoHideDuration?: number;
}

const Notification = (props: NotificationProps) => {
  const { severity, variant, open, onClose, autoHideDuration, message, title } =
    props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration ?? 2000}
      onClose={onClose}
      TransitionComponent={TransitionLeft}
    >
      <Alert variant={variant ?? "filled"} severity={severity ?? "info"}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

const TransitionLeft = (props: SlideProps) => (
  <Slide {...props} direction="right" />
);

export default Notification;
