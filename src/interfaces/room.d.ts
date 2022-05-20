interface Room {
  id: string;
  ownerId: string;
  members: Array<User>;
  issues: Array<Issue>;
  scoreList: number[];
  issueIndex: number;
}
