import { nextRound, revealResult } from "../store/scrumSlice";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button/Button";
import Cards from "./Cards";
import HubContext from "../store/hubContext";
import IssueBox from "./IssueBox";
import ResultChart from "./ResultChart";
import Typography from "@mui/material/Typography";
import { useContext } from "react";

const ScrumView = () => {
  const hub = useContext(HubContext);
  const dispatch = useAppDispatch();
  const [isOwner, issue, isResultRevealed, assigneeName] = useAppSelector(
    (state) => {
      const room = state.scrum.room;
      const assigneeId = room.issues[room.issueIndex].assigneeId;
      return [
        state.scrum.isOwner,
        room.issues[room.issueIndex],
        room.isResultRevealed,
        room.members.find((member) => member.id === assigneeId)?.name ??
          assigneeId,
      ];
    }
  );

  const handleReveal = () => {
    dispatch(revealResult(hub.connection));
  };

  const handleNextRound = () => {
    dispatch(nextRound(hub.connection));
  };

  const AssigneeText = () => (
    <Box>
      <Typography variant="h6" display="inline" noWrap>
        {"Assigned to "}
      </Typography>
      <Typography variant="h6" display="inline" color="primary" noWrap>
        {assigneeName}
      </Typography>
    </Box>
  );

  return (
    <Box className="scrum-screen-view">
      <IssueBox />
      {isOwner &&
        !assigneeName &&
        (isResultRevealed ? (
          <Button size="large" onClick={handleNextRound}>
            next round
          </Button>
        ) : (
          <Button
            size="large"
            onClick={handleReveal}
            disabled={issue.rounds[issue.rounds.length - 1].votes.length === 0}
          >
            reveal result
          </Button>
        ))}
      {assigneeName && <AssigneeText />}
      {isResultRevealed || assigneeName ? (
        <ResultChart issue={issue} />
      ) : (
        <Cards />
      )}
    </Box>
  );
};

export default ScrumView;
