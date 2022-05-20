import Paper from "@mui/material/Paper/Paper";
import { Stack } from "@mui/material";
import { useAppSelector } from "../hooks";

const Votes = () => {
  const votes = useAppSelector((state) => {
    const issue = state.scrum.room.issues[state.scrum.room.issueIndex];
    return issue.rounds[issue.rounds.length - 1].votes;
  });
  const isResultRevealed = useAppSelector(
    (state) => state.scrum.isResultRevealed
  );

  return (
    <div>
      {votes.map((vote, i) => (
        <Stack direction="row" key={i}>
          <Stack alignItems="center">
            <Paper className="points-card vote-card unselectable flex-center">
              <span className="card-span">
                {isResultRevealed ? vote.value : "✓"}
              </span>
            </Paper>
            <span>{vote.userName}</span>
          </Stack>
        </Stack>
      ))}
    </div>
  );
};

export default Votes;
