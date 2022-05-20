import IssueListItem from "./IssueListItem";
import List from "@mui/material/List";
import { useAppSelector } from "../hooks";

const IssueList = () => {
  const [activeIssueIndex, issues] = useAppSelector((state) => [
    state.scrum.room.issueIndex,
    state.scrum.room.issues,
  ]);
  return (
    <List sx={{ width: "100%" }} disablePadding dense>
      {issues.map((issue, i) => (
        <IssueListItem
          key={issue.id}
          issue={issue}
          active={activeIssueIndex === i}
        />
      ))}
    </List>
  );
};

export default IssueList;
