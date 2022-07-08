import { Paper, Typography } from "@mui/material";
import { PropsWithChildren, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import HubContext from "../store/hubContext";
import { castVote } from "../store/scrumSlice";
import { useTheme } from "@mui/system";

interface OutlinedCardProps {
  value: string;
  className?: string;
}

const ScoreCard = (props: PropsWithChildren<OutlinedCardProps>) => {
  const hub = useContext(HubContext);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.scrum.user);
  const roomId = useAppSelector((state) => state.scrum.room.id);
  const issueId = useAppSelector(
    (state) => state.scrum.room.issues[state.scrum.room.issueIndex].id
  );
  const currentVoteValue = useAppSelector(
    (state) => state.scrum.currentVoteValue
  );

  const handleVote = () => {
    dispatch(
      castVote({
        value: {
          roomId: roomId,
          vote: {
            issueId: issueId,
            value: parseFloat(props.value),
            userId: user.id,
            userName: user.name,
          },
        },
        connection: hub.connection,
      })
    );
  };

  const isSelected = currentVoteValue === parseFloat(props.value);
  return (
    <Paper
      className={`${props.className} unselectable`}
      onClick={handleVote}
      sx={{
        transitionProperty: "color, background, box-shadow",
        transitionDuration: 250,
        backgroundColor: isSelected ? theme.palette.primary.main : null,
        color: isSelected ? theme.palette.primary.contrastText : null,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
      elevation={isSelected ? 8 : 1}
    >
      <Typography variant="h4">{props.value}</Typography>
    </Paper>
  );
};

export default ScoreCard;
