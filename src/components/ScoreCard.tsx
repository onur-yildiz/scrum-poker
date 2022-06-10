import { PropsWithChildren, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import HubContext from "../store/hubContext";
import { Paper } from "@mui/material";
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
      className={`${props.className} flex-center unselectable`}
      onClick={handleVote}
      sx={{
        backgroundColor: isSelected ? theme.palette.primary.main : null,
        color: isSelected ? theme.palette.primary.contrastText : null,
      }}
    >
      <span className="card-span">{props.value}</span>
    </Paper>
  );
};

export default ScoreCard;
