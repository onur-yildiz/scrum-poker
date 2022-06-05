import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Box, Typography } from "@mui/material";

import { Bar } from "react-chartjs-2";
import { PropsWithChildren } from "react";

const colors = [
  "#3cb44b",
  "#e6194b",
  "#ffe119",
  "#0082c8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#d2f53c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#aa6e28",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000080",
  "#808080",
];
interface ResultChartProps {
  issue: Issue;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
      },
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "VOTE DISTRUBIUTION",
    },
  },
};

const ResultChart = (props: PropsWithChildren<ResultChartProps>) => {
  // const theme = useTheme();
  // const rounds = useAppSelector((state) => {
  //   const room = state.scrum.room;
  //   const issue = room.issues[room.issueIndex];
  //   return issue.rounds;
  // });
  const rounds = props.issue.rounds;
  // const votes = rounds[rounds.length - 1].votes.map((vote) => vote.value);
  const votes = rounds.flatMap((round) =>
    round.votes.map((vote) => vote.value)
  );
  // generate array of random numbers from 0 to 10 with duplicates
  // votes = votes.concat(
  //   Array(100 - votes.length)
  //     .fill(0)
  //     .map(() => Math.floor(Math.random() * 10))
  // );

  const labels = Array.from(new Set(votes)).sort(); // TODO: better way

  const data: ChartData<"bar", any, any> = {
    labels,
    datasets: rounds.map((round, i) => ({
      label: `Round ${i + 1}`,
      hidden: i !== rounds.length - 1,
      data: labels.map(
        (label) => round.votes.filter((vote) => vote.value === label).length
      ),
      backgroundColor: colors[i % colors.length],
    })),
  };

  const roundAverage =
    rounds[rounds.length - 1].votes.reduce((a, b) => a + b.value, 0) /
    rounds[rounds.length - 1].votes.length;
  const cumulativeAverage =
    votes.reduce((prev, cur) => prev + cur) / votes.length;
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
      }}
    >
      <Typography variant="subtitle2" display="inline" sx={{ mr: 2 }}>
        Round Average: {roundAverage.toFixed(2)}
      </Typography>
      <Typography variant="subtitle2" display="inline">
        Cumulative Average: {cumulativeAverage.toFixed(2)}
      </Typography>
      <Bar options={options} data={data} />
    </Box>
  );
};

export default ResultChart;
