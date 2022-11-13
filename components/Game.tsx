import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GameObj } from "../lib/steamUtils";
import { PlayerCount } from "../pages/classic";
import styles from "../styles/game-style.module.scss";

type GameProps = {
  game: GameObj | undefined;
  isStart?: boolean;
  isHigher: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setPlayerCounts: React.Dispatch<React.SetStateAction<PlayerCount>>;
};

type GameResponse = {
  playerCount: number;
}

function steamImageLoader({ src }: { src: string }) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${src}/header.jpg`;
}

const btnStyles = "py-3 px-5 text-5xl rounded-lg "

export default function Game({
  game,
  isStart,
  isHigher,
  setPlayerCounts,
}: GameProps) {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [playerCount, setPlayerCount] = useState<number>();
  let [hasClicked, setHasClicked] = useState(isStart ? true : false);

  const clickHandler = (higher: boolean) => {
    setHasClicked(true);
    isHigher(higher)
  };

  useEffect(() => {
    if (!game) return;
    if(!isStart) setHasClicked(false);
    setLoading(true);
    fetch(`/api/game`, {
      method: "POST",
      body: game.appId,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data: GameResponse) => {
        setPlayerCount(data.playerCount);
        setPlayerCounts(prev => ({playerCounts: {
          ...prev.playerCounts,
          [`${game.appId}`]: data.playerCount
        }}));
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [game, isStart, setPlayerCounts]);

  if (!game)
    return <div className="game-price text-2xl mt-5 flex-1 text-center w-1/2">loading</div>;

  if (error)
    return (
      <div className="game-price text-2xl mt-5 text-center">
        There was an error loading the game
      </div>
    );
  return (
    <div
      className={`${styles.game} py-24 h-half w-full md:w-1/2 md:h-1/3 md:py-0 flex flex-col justify-between items-center relative`}
    >
      <h2
        className={`${styles.game__title} z-10 text-center px-6 text-5xl w-fit mx-auto flex-1 pb-12`}
      >
        {game.title}
      </h2>

      <div className={`absolute top-1/2 left-1/2 h-half md:h-screen w-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}>
          <Image
            className={`${styles.steam__img} opacity-50 blur-sm scale-90 z-0 relative brightness-50`}
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

        {hasClicked === false ? (
          <div className="guess-group flex justify-center h-32 gap-6 items-center mt-auto text-xl">
            <button
              onClick={() => clickHandler(true)}
              className={`${btnStyles} bg-gradient-to-r from-blue-300 to-blue-600`}
            >
              higher
            </button>
            Or
            <button
              onClick={() => clickHandler(false)}
              className={`${btnStyles} bg-gradient-to-l from-red-300 to-red-600`}
            >
              lower
            </button>
          </div>
        ) : (
          <p
            className={`${styles.game__price} text-8xl h-32 mt-auto text-center z-10 w-fit mx-auto animate-fade-in`}
          >
            {loading ? "loading" : playerCount?.toLocaleString()}
          </p>
        )}

        <p className="game-price text-lg text-center">
          people playing
        </p>
      </div>
    </div>
  );
}
