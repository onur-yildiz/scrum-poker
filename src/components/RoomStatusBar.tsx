import ListItem from "@mui/material/ListItem";
import Numbers from "@mui/icons-material/Numbers";
import Person from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../hooks";

const RoomStatusBar = () => {
  const [issueTitle, roundNumber, memberCount] = useAppSelector((state) => {
    const room = state.scrum.room;
    const issue = room.issues[room.issueIndex];
    return [issue.title, issue.rounds.length, room.members.length];
  });

  return (
    <ListItem>
      <Person />
      <Typography sx={{ flexGrow: 1 }} variant="h6" noWrap>
        {memberCount}
      </Typography>
      <Typography variant="h6" noWrap>
        {issueTitle}
      </Typography>
      <Numbers />
      <Typography variant="h6" noWrap>
        {roundNumber}
      </Typography>
    </ListItem>
  );
};

export default RoomStatusBar;
