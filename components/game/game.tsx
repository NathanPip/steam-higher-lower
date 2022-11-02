import { useEffect, useState } from "react";
import styles from "./game.module.css";


type GameProps = {
  game: {
    title: string;
    playerCount: number;
  };
  isGuess: boolean;
  higher?: boolean;
  outcome?: any
};


export default function Game(
  { game, isGuess, higher }: GameProps = {
    game: { title: "unavailable", playerCount: 0 },
    isGuess: false,
  }
) {

    let [playerCount, setPlayerCount] = useState(game.playerCount);

    const gameWinHandler = (isHigherBtn: boolean) => {
        if(higher && isHigherBtn) {

        }
    }

  return (
    <>
      <div className="text-center py-4">
        <h2 className="game-title text-5xl">{game.title}</h2>
        <p className="game-price text-2xl mt-5">{playerCount}</p>
      </div>
      {isGuess && (
        <div className="guess-group flex flex-col justify-around items-center mt-3 text-2xl h-1/4">
          <button className={`higher ${styles.btn} mb-3 bg-green-500`}>higher</button>
          Or
          <button className={`lower ${styles.btn} bg-red-500`}>lower</button>
        </div>
      )}
    </>
  );
}
