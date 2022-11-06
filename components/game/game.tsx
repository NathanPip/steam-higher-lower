import Image from "next/image";
import { useEffect, useState } from "react";
import { GameObj } from "../../lib/steamUtils";
import styles from "./game.module.scss";

type GameProps = {
  game: GameObj | undefined;
  isGuess: boolean;
  setCount: any;
  setHigher?: any;
};

function steamImageLoader({ src }: { src: string }) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${src}/header.jpg`;
}

const btnStyles = "py-3 px-5 text-5xl rounded-lg"

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

  if (loading || !game)
    return <div className="game-price text-2xl mt-5 flex-1 text-center">loading</div>;

  if (error)
    return (
      <div className="game-price text-2xl mt-5 text-center">
        There was an error loading the game
      </div>
    );

  return (
    <div
      className={`${styles.game} flex-1 flex flex-col justify-between items-center h-1/3 relative`}
    >
      <h2
        className={`${styles.game__title} z-10 text-center px-6 text-5xl w-fit mx-auto flex-1 pb-12`}
      >
        {game.title}
      </h2>

      <div className={`${styles.image__container} absolute top-1/2 left-1/2 h-screen w-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}>
          <Image
            className={`${styles.steam__img} opacity-50 blur-sm scale-90 z-0 relative  brightness-50`}
            loader={steamImageLoader}
            src={game.appId}
            alt={`${game.title} game`}
            width="750"
            height="500"
          >
          </Image>
      </div>

      <div className="z-10">
        <p className="text-lg text-center">currently has</p>

        {isGuess && !hasClicked ? (
          <div className="guess-group flex justify-center h-32 gap-6 items-center mt-auto text-xl">
            <button
              onClick={() => clickHandler(true)}
              className={`higher ${btnStyles} bg-green-500`}
            >
              higher
            </button>
            Or
            <button
              onClick={() => clickHandler(false)}
              className={`lower ${btnStyles} bg-red-500`}
            >
              lower
            </button>
          </div>
        ) : (
          <p
            className={`${styles.game__price} text-8xl h-32 mt-auto text-center z-10 w-fit mx-auto`}
          >
            {playerCount?.toLocaleString()}
          </p>
        )}

        <p className="game-price text-lg text-center">
          people playing
        </p>
      </div>
    </div>
  );
}
