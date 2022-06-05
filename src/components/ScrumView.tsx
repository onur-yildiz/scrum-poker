import { nextRound, revealResult } from "../store/scrumSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import Cards from "./Cards";
import IssueBox from "./IssueBox";
import ResultChart from "./ResultChart";
import Typography from "@mui/material/Typography";

const ScrumView = () => {
  const dispatch = useAppDispatch();
  const [isOwner, issue, isResultRevealed, assigneeName] = useAppSelector(
    (state) => {
      const room = state.scrum.room;
      return [
        state.scrum.isOwner,
        room.issues[room.issueIndex],
        room.isResultRevealed,
        room.members.find(
          (member) => member.id === room.issues[room.issueIndex].assigneeId
        )?.name,
      ];
    }
  );

  const handleReveal = () => {
    dispatch(revealResult());
  };

  const handleNextRound = () => {
    dispatch(nextRound({ value: null, shouldEmit: true }));
  };

  return (
    <Box className="scrum-screen-view">
      <IssueBox />
      {isOwner && !isResultRevealed && (
        <Button
          size="large"
          onClick={handleReveal}
          disabled={issue.rounds[issue.rounds.length - 1].votes.length === 0}
        >
          reveal result
        </Button>
      )}
      {isOwner && isResultRevealed && !assigneeName && (
        <Button size="large" onClick={handleNextRound}>
          next round
        </Button>
      )}
      {assigneeName && (
        <Box>
          <Typography variant="h6" display="inline" noWrap>
            {"Assigned to "}
          </Typography>
          <Typography variant="h6" display="inline" color="primary" noWrap>
            {assigneeName}
          </Typography>
        </Box>
      )}
      {isResultRevealed ? <ResultChart issue={issue} /> : <Cards />}
    </Box>
  );
};

export default ScrumView;
