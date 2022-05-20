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

import { Bar } from "react-chartjs-2";
import { PropsWithChildren } from "react";

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
      // backgroundColor: theme.palette.primary.dark,
    })),
  };

  return <Bar options={options} data={data} />;
};

export default ResultChart;
