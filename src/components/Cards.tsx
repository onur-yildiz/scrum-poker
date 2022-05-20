import Grid from "@mui/material/Grid";
import ScoreCard from "./ScoreCard";
import { useAppSelector } from "../hooks";

const Cards = () => {
  const cardValues = useAppSelector((state) => state.scrum.room.scoreList);
  const generateCards = () => {
    const cards = [];
    for (let i = 0; i < cardValues.length; i++) {
      cards.push(
        <ScoreCard
          className={cardValues.length > 12 ? "score-card-small" : "score-card"}
          key={i}
          value={cardValues[i].toString()}
        />
      );
    }

    return cards;
  };

  return (
    <Grid
      container
      spacing={3}
      className={"card-grid"}
      style={{ justifyContent: "center" }}
    >
      {generateCards()}
    </Grid>
  );
};

export default Cards;
