import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import EndGame from "../components/EndGame/EndGame";
import Game from "../components/Game/game";
import { delay } from "../lib/helpers";
import { GameObj } from "../lib/steamUtils";

export default function Classic({ games }: { games: Array<GameObj> }) {
  const [game1, setGame1] = useState<GameObj>();
  const [game2, setGame2] = useState<GameObj>();
  const [count1, setCount1] = useState<number>();
  const [count2, setCount2] = useState<number>();
  const [higher, setHigher] = useState<boolean>();
  const [wins, setWins] = useState(0);
  const [justWon, setJustWon] = useState(false);
  const [displayEndGame, setDisplayEndGame] = useState(false);
  const gameContainer = useRef(null);

  const getRandomIndex = () => {
    return Math.floor(Math.random() * games.length);
  };

  const handleWin = async () => {
    if (!game1 || !game2) return;
    setWins((prev) => prev + 1);
    setJustWon(true);
    await delay(2000);
    setJustWon(false);
    setGame1({ ...game2, playerCount: count2 });
    handleNextGame();
  };

  const handleLose = () => {
    console.log("lost");
    setWins(0);
    setDisplayEndGame(false);
    startGame();
  };

  const handleNextGame = () => {
    let newGameIndex = getRandomIndex();
    let game = games[newGameIndex];
    while (games[newGameIndex].hasPlayed || game.appId === game2?.appId) {
      newGameIndex = getRandomIndex();
      game = games[newGameIndex];
    }
    games[newGameIndex].hasPlayed = true;
    setCount1(count2);
    setGame2(game);
  };

  const startGame = () => {
    if (!games) return;
    for (let i = 0; i < games.length; i++) {
      games[i].hasPlayed = false;
    }
    let rand1 = Math.floor(Math.random() * games.length);
    let game1 = games[rand1];
    let rand2 = 0;
    let game2;
    while (game2 === undefined || game1.appId === game2.appId) {
      rand2 = Math.floor(Math.random() * games.length);
      game2 = games[rand2];
    }
    console.log(games[rand1]);
    games[rand1].hasPlayed = true;
    games[rand2].hasPlayed = true;
    setGame1(game1);
    setGame2(game2);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (higher === undefined || count1 === undefined || count2 === undefined)
      return;
    if (
      (count1 > count2 && higher === false) ||
      (count1 < count2 && higher === true)
    ) {
      handleWin();
      setHigher(undefined);
    } else {
      setDisplayEndGame(true);
      setHigher(undefined);
    }
  }, [higher]);

  return (
    <div className="overflow-x-hidden w-screen">
      <div
        ref={gameContainer}
        className={`${
          justWon ? "animate-slide-left" : ""
        } h-screen flex justify-between items-center `}
      >
        <Game game={game1} isGuess={false} setCount={setCount1}></Game>
        <div className="flex-3 h-full bg-black w-3">
          <div className="rounded-full h-12 w-12 bg-black flex items-center justify-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {wins}
          </div>
        </div>
        <Game
          game={game2}
          isGuess={true}
          setCount={setCount2}
          setHigher={setHigher}
        ></Game>
        <Game
          game={game2}
          isGuess={true}
          setCount={setCount2}
          setHigher={setHigher}
        ></Game>
        {displayEndGame && (
          <EndGame onClick={handleLose} score={wins}></EndGame>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();
  try {
    const games = await prisma.topSteamGames.findFirst();
    if (!games) throw new Error("no games found");
    console.log(games.games);
    let gameArr = JSON.parse(games.games);
    return {
      props: {
        games: gameArr,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        games: null,
        error: err,
      },
    };
  }
};
