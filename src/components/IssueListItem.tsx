import { Fragment, PropsWithChildren, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Collapse from "@mui/material/Collapse";
import Delete from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import ListItem from "@mui/material/ListItem";
import ResultChart from "./ResultChart";
import Typography from "@mui/material/Typography";
import { removeIssue } from "../store/scrumSlice";
import { useTheme } from "@mui/system";

interface IssueRowProps {
  issue: Issue;
  active?: boolean;
}

const IssueListItem = (props: PropsWithChildren<IssueRowProps>) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isOwner, issuesLength, assigneeName] = useAppSelector((state) => {
    const room = state.scrum.room;
    return [
      state.scrum.isOwner,
      room.issues.length,
      room.members.find((member) => member.id === props.issue.assigneeId)
        ?.name ?? props.issue.assigneeId,
    ];
  });
  const [open, setOpen] = useState(false);

  const handleRemove = () => {
    dispatch(removeIssue({ value: props.issue.id, shouldEmit: true }));
  };

  return (
    <Fragment>
      <ListItem>
        {props.active && (
          <Divider
            orientation="vertical"
            sx={{
              position: "absolute",
              height: "2.5em",
              left: ".5em",
              width: ".25em",
              backgroundColor: theme.palette.primary.main,
            }}
          />
        )}
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
        <Typography
          sx={{ minWidth: "max-content", margin: 1 }}
          variant="h6"
          textAlign="left"
          component="p"
        >
          {props.issue.title}
        </Typography>
        {assigneeName && (
          <Typography
            sx={{ marginRight: 2 }}
            variant="subtitle1"
            fontWeight="bold"
            textAlign="left"
            component="span"
            color="primary"
            noWrap
          >
            {assigneeName}
          </Typography>
        )}
        {!open && (
          <Typography
            sx={{ marginRight: "auto" }}
            variant="caption"
            textAlign="left"
            component="span"
            noWrap
          >
            {props.issue.description}
          </Typography>
        )}
        {isOwner && (
          <IconButton
            sx={{ marginLeft: "auto" }}
            onClick={handleRemove}
            disabled={issuesLength === 1}
            edge="end"
            aria-label="delete"
            color="error"
          >
            <Delete />
          </IconButton>
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Typography
          sx={{ marginLeft: "1.5em" }}
          variant="subtitle1"
          textAlign="left"
          component="p"
        >
          {props.issue.description}
        </Typography>
        {props.issue.rounds[0].votes.length > 0 && (
          <ResultChart issue={props.issue} hideRoundAverage />
        )}
      </Collapse>
    </Fragment>
  );
};

export default IssueListItem;
