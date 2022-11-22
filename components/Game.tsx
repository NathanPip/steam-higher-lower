import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { GameObj } from "../utils/steamUtils";
import styles from "../styles/game-style.module.scss";

type GameProps = {
  game: GameObj | undefined;
  isStart?: boolean;
  isHigher: React.Dispatch<React.SetStateAction<boolean>>;
};

function steamImageLoader({ src }: { src: string }) {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${src}/header.jpg`;
}

const btnStyles = "py-3 px-5 text-4xl rounded-lg "

const Game: React.FC<GameProps> = ({
  game,
  isStart,
  isHigher,
}) => {
  const [hasClicked, setHasClicked] = useState(isStart ? true : false);
  const [hoverHigher, setHoverHigher] = useState<boolean>()

  const clickHandler = (higher: boolean) => {
    setHasClicked(true);
    isHigher(higher)
  };

  useEffect(() => {
    if (!game || isStart) return;
    setHasClicked(false);
  }, [game, isStart])

  if (!game)
    return <div className="game-price text-2xl mt-5 flex-1 text-center w-1/2">loading</div>;

  return (
    <div
      className={`${styles.game} py-24 h-half w-full md:w-1/2 md:h-1/3 md:py-0 flex flex-col justify-between items-center relative`}
    >
      <h2
        className={`${styles.game__title} transition-transform duration-500 z-10 text-center px-6 text-5xl w-fit mx-auto flex-1 pb-12`}
      >
        {game.title}
      </h2>

      <div className={`absolute top-1/2 left-1/2 h-half md:h-screen w-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center`}>
          <Image
            className={`${styles.steam__img} transition-all duration-500 opacity-50 blur-sm scale-90 z-0 relative brightness-50 
                        ${hoverHigher === true && "-translate-y-2 shadow-higherHover"} 
                        ${hoverHigher === false && "translate-y-2 shadow-lowerHover"}`}
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
          <div className="guess-group flex justify-center h-32 gap-3 items-center mt-auto text-xl">
            <button
              onClick={() => clickHandler(true)}
              onMouseEnter={() => {setHoverHigher(true)}}
              onMouseLeave={() => {setHoverHigher(undefined)}}
              className={`${btnStyles} bg-gradient-to-r from-sky-500 to-sky-800 brightness-100 hover:brightness-125 transition-all duration-300`}
            >
              higher
            </button>
            Or
            <button
              onClick={() => clickHandler(false)}
              onMouseEnter={() => {setHoverHigher(false)}}
              onMouseLeave={() => {setHoverHigher(undefined)}}
              className={`${btnStyles} bg-gradient-to-l from-rose-500 to-rose-800 brightness-100 hover:brightness-125 transition-all duration-300`}
            >
              lower
            </button>
          </div>
        ) : (
          <p
            className={`${styles.game__price} transition-transform duration-500 text-8xl h-32 mt-auto text-center z-10 w-fit mx-auto animate-fade-in`}
          >
            {game.playerCount?.toLocaleString()}
          </p>
        )}

        <p className="game-price text-lg text-center">
          people playing
        </p>
      </div>
    </div>
  );
}
export default Game;