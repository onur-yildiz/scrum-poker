import { nextRound, revealResult } from "../store/scrumSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import Cards from "./Cards";
import IssueBox from "./IssueBox";
import ResultChart from "./ResultChart";

const ScrumView = () => {
  const dispatch = useAppDispatch();
  const isResultRevealed = useAppSelector(
    (state) => state.scrum.isResultRevealed
  );
  const isOwner = useAppSelector((state) => state.scrum.isOwner);
  const issue = useAppSelector(
    (state) => state.scrum.room.issues[state.scrum.room.issueIndex]
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
      {isOwner && isResultRevealed && (
        <Button size="large" onClick={handleNextRound}>
          next round
        </Button>
      )}
      {isResultRevealed ? <ResultChart issue={issue} /> : <Cards />}
    </Box>
  );
};

export default ScrumView;
