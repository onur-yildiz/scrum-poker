import { useAppDispatch, useAppSelector } from "../hooks";

import { Paper } from "@mui/material";
import { PropsWithChildren } from "react";
import { castVote } from "../store/scrumSlice";
import { useTheme } from "@mui/system";

interface OutlinedCardProps {
  value: string;
  className?: string;
}

const ScoreCard = (props: PropsWithChildren<OutlinedCardProps>) => {
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
        roomId: roomId,
        vote: {
          issueId: issueId,
          value: parseFloat(props.value),
          userId: user.id,
          userName: user.name!,
        },
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
