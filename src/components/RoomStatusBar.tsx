import { Fragment } from "react";
import ListItem from "@mui/material/ListItem";
import Numbers from "@mui/icons-material/Numbers";
import Person from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../hooks";

const RoomStatusBar = () => {
  const [roundNumber, memberCount, consensusThreshold] = useAppSelector(
    (state) => {
      const room = state.scrum.room;
      const issue = room.issues[room.issueIndex];
      return [
        issue.rounds.length,
        room.members.length,
        room.consensusThreshold,
      ];
    }
  );

  return (
    <Fragment>
      <ListItem>
        <Person />
        <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap>
          {memberCount}
        </Typography>
        <Numbers />
        <Typography variant="h6" noWrap>
          {roundNumber}
        </Typography>
      </ListItem>
      {consensusThreshold > 2 && (
        <ListItem>
          <Typography variant="subtitle2" noWrap>
            Auto-assign at {consensusThreshold} identical votes
          </Typography>
        </ListItem>
      )}
    </Fragment>
  );
};

export default RoomStatusBar;
