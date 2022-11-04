import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
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
  const [displayEndGame, setDisplayEndGame] = useState(false);

  const getRandomIndex = () => {
    return Math.floor(Math.random() * games.length);
  };

  const handleWin = async () => {
    if (!game1 || !game2) return;
    setWins((prev) => prev + 1);
    await delay(2000);
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
    console.log(count1);
    console.log(count2);
  }, [count1, count2]);

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
    <div className="h-screen flex flex-col justify-around">
      <Game game={game1} isGuess={false} setCount={setCount1}></Game>
      <div className="score-container flex-3 text-center">{wins}</div>
      <Game
        game={game2}
        isGuess={true}
        setCount={setCount2}
        setHigher={setHigher}
      ></Game>
      {displayEndGame && <EndGame onClick={handleLose} score={wins}></EndGame>}
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
