interface Issue {
  id: string;
  creatorId: string;
  assigneeId?: string;
  title: string;
  description: string;
  rounds: Round[];
}
