import Box from "@mui/material/Box";
import IssueForm from "./IssueForm";
import IssueList from "./IssueList";

const IssuesView = () => {
  return (
    <Box className="scrum-screen-view">
      <IssueForm />
      <IssueList />
    </Box>
  );
};

export default IssuesView;
