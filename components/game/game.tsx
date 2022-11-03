import { useEffect, useState } from "react";
import { GameObj } from "../../lib/steamUtils";
import styles from "./game.module.css";

type GameProps = {
  game: (GameObj | undefined);
  isGuess: boolean;
  setCount: any;
  setHigher?: any;
};

export default function Game({ game, isGuess, setCount, setHigher }: GameProps) {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [playerCount, setPlayerCount] = useState<number>();
  let [hasClicked, setHasClicked] = useState(false);

  const clickHandler = (higher: boolean) => {
    setHasClicked(true);
    console.log(isGuess)
    setHigher(higher);
  }

  useEffect(() => {
    if (!game) return;
    setHasClicked(false);
    if(game.playerCount) {
      setPlayerCount(game.playerCount);
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
      setCount(data.playerCount);
      setLoading(false);
    }).catch(err => {
      setError(err);
      setLoading(false);
    })
  }, [game, setCount]);

  return (
    <>
    {loading || !game ? 
      <div>loading</div> 
      :
      <>
      <div className="text-center py-4">
        <h2 className="game-title text-5xl">{game.title}</h2>
      </div>
      {isGuess && !hasClicked ? (
        <div className="guess-group flex justify-center gap-6 items-center mt-3 text-2xl h-1/4">
          <button onClick={() => clickHandler(false)}className={`lower ${styles.btn} bg-red-500`}>lower</button>
          Or
          <button onClick={() => clickHandler(true)}className={`higher ${styles.btn} mb-3 bg-green-500`}>
            higher
          </button>
        </div>
      ) : <p className="game-price text-2xl mt-5 text-center">{playerCount}</p>}
      </>
    }
    </>
  );
}
