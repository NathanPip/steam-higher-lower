import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Game from "../components/game/game";
import { GameObj } from "../lib/steamUtils";

export default function Classic({ games }: { games: Array<GameObj> }) {
  const [game1, setGame1] = useState<GameObj>();
  const [game2, setGame2] = useState<GameObj>();
  const [count1, setCount1] = useState<number>();
  const [count2, setCount2] = useState<number>();
  const [higher, setHigher] = useState<boolean>();
  const [wins, setWins] = useState(0);

  const handleWin = () => {
    if(!game1 || !game2) return;
    setWins(prev => prev+1);
    setGame1({...game2, playerCount: count2});
    let newGameIndex = getRandomIndex();
    let game = games[newGameIndex];
    while(games[newGameIndex].hasPlayed || game.appId === game2?.appId) {
      newGameIndex = getRandomIndex();
      game = games[newGameIndex];
    }
    games[newGameIndex].hasPlayed = true;
    setCount1(count2);
    setGame2(game)
  };

  const getRandomIndex = () => {
    return Math.floor(Math.random() * games.length);
  }

  useEffect(() => {
    if (!games) return;
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
      setHigher(undefined);
    }
  }, [higher]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-2 justify-center flex flex-col pt-24">
        <Game game={game1} isGuess={false} setCount={setCount1}></Game>
      </div>
      <div className="flex-1 justify-center flex flex-col">
        <Game
          game={game2}
          isGuess={true}
          setCount={setCount2}
          setHigher={setHigher}
        ></Game>
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
