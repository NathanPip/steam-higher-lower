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
  const [game3, setGame3] = useState<GameObj>();
  const [playables, setPlayables] = useState<Array<GameObj>>();
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
    if (!game1 || !game2 || !playables) return;
    const currWins = wins; 
    setWins((prev) => prev + 1);
    setJustWon(true);
    await delay(2000);
    setJustWon(false);
    setGame1({ ...game2, playerCount: count2 });
    setGame2(game3)
    setGame3(playables[currWins+3])
    await delay(1000)
    console.log(game1)
    console.log(game2)
    console.log(game3)
    console.log(count1)
    console.log(count2)
  };

  const handleLose = () => {
    console.log("lost");
    setWins(0);
    setDisplayEndGame(false);
    startGame();
  };

  const startGame = () => {
    if (!games) return;
    const newGames = getShuffledGames();
    setGame1(newGames[0]);
    setGame2(newGames[1]);
    setGame3(newGames[2]);
    setPlayables(newGames);
  };

  const getShuffledGames = () => {
    let tempGames = [...games];
    let newGames = [];
    while(tempGames.length) {
      let rand = Math.floor(Math.random() * tempGames.length);
      newGames.push(tempGames[rand]);
      tempGames.splice(rand,1)
    }
    return newGames;
  }

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
        {/* <div className="flex-3 h-full bg-black w-3">
          <div className="rounded-full h-12 w-12 bg-black flex items-center justify-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {wins}
          </div>
        </div> */}
        <Game
          game={game2}
          isGuess={true}
          setCount={setCount2}
          setHigher={setHigher}
        ></Game>
        <Game
          game={game3}
          isGuess={true}
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
