import { Check, QuestionMark } from "@mui/icons-material";

import { Box } from "@mui/system";
import { PropsWithChildren } from "react";
import { Typography } from "@mui/material";
import { useAppSelector } from "../hooks";

interface VoteResultBoxProps {
  userId: string;
}

const VoteResultBox = (props: PropsWithChildren<VoteResultBoxProps>) => {
  const vote = useAppSelector((state) => {
    const room = state.scrum.room;
    const issue = room.issues[room.issueIndex];
    return (
      issue.rounds[issue.rounds.length - 1].votes.find(
        (vote) => vote.userId === props.userId
      ) ?? ({ value: -1 } as Vote)
    );
  });
  const clientUserId = useAppSelector((state) => state.scrum.user.id);
  const isResultRevealed = useAppSelector(
    (state) => state.scrum.isResultRevealed
  );

  const isClientUser = clientUserId === vote.userId;
  const hasVoted = vote.value !== -1;
  const resultVal = hasVoted ? (
    <Typography className="unselectable" color="primary" variant="h5">
      {vote.value}
    </Typography>
  ) : (
    <QuestionMark />
  );
  const preResultVal = hasVoted ? (
    <Check color="primary" />
  ) : (
    <QuestionMark color="secondary" />
  );

  return (
    <Box className="vote-result-box">
      {isResultRevealed || isClientUser ? resultVal : preResultVal}
    </Box>
  );
};

export default VoteResultBox;
