import { useEffect, useState } from "react";
import { GameObj } from "../../lib/steamUtils";
import styles from "./game.module.css";

type GameProps = {
  game: (GameObj | undefined);
  isGuess: boolean;
  setCount?: any;
};

export default function Game({ game, isGuess }: GameProps) {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [playerCount, setPlayerCount] = useState();

  useEffect(() => {
    if (!game) return;
    if(game.playerCount) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `/api/game`, {
        method: "POST",
        body: game.appId
      }
    )
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(data => {
      setPlayerCount(data.playerCount);
      setLoading(false);
    }).catch(err => {
      setError(err);
    })
  }, [game]);

  return (
    <>
    {loading ? 
      <div>loading</div> 
      :
      <>
      <div className="text-center py-4">
        <h2 className="game-title text-5xl">{game.title}</h2>
      </div>
      {isGuess ? (
        <div className="guess-group flex flex-col justify-around items-center mt-3 text-2xl h-1/4">
          <button className={`higher ${styles.btn} mb-3 bg-green-500`}>
            higher
          </button>
          Or
          <button className={`lower ${styles.btn} bg-red-500`}>lower</button>
        </div>
      ) : <p className="game-price text-2xl mt-5 text-center">{playerCount}</p>}
      </>
    }
    </>
  );
}
