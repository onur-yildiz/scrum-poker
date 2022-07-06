import { FormEvent, useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import HubContext from "../store/hubContext";
import TextField from "@mui/material/TextField/TextField";
import { newIssue } from "../store/scrumSlice";
import { v4 } from "uuid";

const IssueForm = () => {
  const hub = useContext(HubContext);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const dispatch = useAppDispatch();
  const [userId, issuesLength] = useAppSelector((state) => [
    state.scrum.user.id,
    state.scrum.room.issues.length,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const issue: Issue = {
      id: v4(),
      creatorId: userId,
      title: issueTitle.length !== 0 ? issueTitle : `Issue ${issuesLength + 1}`, // TODO DRY see IssueBox
      description:
        issueDescription.length !== 0
          ? issueDescription
          : `No description provided.`,
      rounds: [{ votes: [] }],
    };
    dispatch(newIssue({ value: issue, connection: hub.connection }));
    setIssueDescription("");
    setIssueTitle("");
  };

  return (
    <Box component="form" className="issue-form" onSubmit={handleSubmit}>
      <TextField
        id="issue-form-title"
        label="Title"
        value={issueTitle}
        onChange={(e) => setIssueTitle(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        id="issue-form-description"
        label="Description"
        multiline
        rows={4}
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Button variant="contained" size="large" disableElevation type="submit">
        Create
      </Button>
    </Box>
  );
};

export default IssueForm;
