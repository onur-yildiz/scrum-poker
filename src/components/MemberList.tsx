import { List, ListItem, Paper, Typography } from "@mui/material";

import AssignmentInd from "@mui/icons-material/AssignmentInd";
import RoomStatusBar from "./RoomStatusBar";
import StarsIcon from "@mui/icons-material/Stars";
import VoteResultBox from "./VoteResultBox";
import { memo } from "react";
import { useAppSelector } from "../hooks";

const MemberList = memo(() => {
  const [members, roomOwnerId, assigneeId] = useAppSelector((state) => {
    const room = state.scrum.room;
    return [
      room.members,
      room.ownerId,
      room.issues[room.issueIndex].assigneeId,
    ];
  });

  // create 100 length array with random names
  // let names = [];
  // for (let i = 0; i < 100; i++) {
  //   var x = Math.random().toString(36).substring(7).toString();
  //   names.push({ id: x, name: x } as User);
  // }

  return (
    <Paper variant="outlined" square className="member-list-container">
      <List disablePadding>
        <RoomStatusBar />
        {members.map((member) => (
          <ListItem sx={{ height: "4em" }} divider key={member.id}>
            <VoteResultBox userId={member.id} />
            <Typography sx={{ flexGrow: 1 }} noWrap>
              {member.name}
            </Typography>
            {member.id === assigneeId && <AssignmentInd color="primary" />}
            {member.id === roomOwnerId && <StarsIcon color="warning" />}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
});

export default MemberList;
