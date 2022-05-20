import { List, ListItem, Paper, Typography } from "@mui/material";

import RoomStatusBar from "./RoomStatusBar";
import StarsIcon from "@mui/icons-material/Stars";
import VoteResultBox from "./VoteResultBox";
import { memo } from "react";
import { useAppSelector } from "../hooks";

const MemberList = memo(() => {
  const members = useAppSelector((state) => state.scrum.room.members);
  const roomOwnerId = useAppSelector((state) => state.scrum.room.ownerId);

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
            {member.id === roomOwnerId && <StarsIcon />}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
});

export default MemberList;
