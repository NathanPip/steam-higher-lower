import Image from "next/image";
import { useEffect, useState } from "react";
import { GameObj } from "../../lib/steamUtils";
import styles from "./game.module.css";

type GameProps = {
  game: GameObj | undefined;
  isGuess: boolean;
  setCount: any;
  setHigher?: any;
};

function steamImageLoader({ src }: {src: string}) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${src}/header.jpg`
}

export default function Game({
  game,
  isGuess,
  setCount,
  setHigher,
}: GameProps) {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [playerCount, setPlayerCount] = useState<number>();
  let [hasClicked, setHasClicked] = useState(false);

  const clickHandler = (higher: boolean) => {
    setHasClicked(true);
    console.log(isGuess);
    setHigher(higher);
  };

  useEffect(() => {
    if (!game) return;
    setHasClicked(false);
    if (game.playerCount) {
      setPlayerCount(game.playerCount);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/game`, {
      method: "POST",
      body: game.appId,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setPlayerCount(data.playerCount);
        setCount(data.playerCount);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [game, setCount]);

  return (
    <>
      {loading || !game ? (
        <div className="game-price text-2xl mt-5 text-center">loading</div>
      ) : (
        <div className="flex-1 justify-center flex flex-col relative">
          <div className="text-center py-4 z-10">
            <h2 className="game-title text-5xl">{game.title}</h2>
            <p className="game-price text-2xl mt-5 text-center">
              player count is
            </p>
          </div>

          <Image
            className={`${styles.steam__img} opacity-50
            blur-sm scale-90 z-0`}
            loader={steamImageLoader}
            src={game.appId}
            alt={`${game.title} game`}
            width="500"
            height="300"
        >
        </Image>

          {isGuess && !hasClicked ? (
            <div className="guess-group flex justify-center gap-6 items-center mt-3 text-2xl h-1/4">
              <button
                onClick={() => clickHandler(false)}
                className={`lower ${styles.btn} bg-red-500`}
              >
                lower
              </button>
              Or
              <button
                onClick={() => clickHandler(true)}
                className={`higher ${styles.btn} mb-3 bg-green-500`}
              >
                higher
              </button>
            </div>
          ) : (
            <p className="game-price text-2xl mt-5 text-center">
              {playerCount}
            </p>
          )}
        </div>
      )}
    </>
  );
}
