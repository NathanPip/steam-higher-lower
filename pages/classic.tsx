import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Game from "../components/game/game";
import { GameObj } from "../lib/steamUtils";

export default function Classic({games}: {games: Array<GameObj>}) {

  const [game1, setGame1] = useState<GameObj>();
  const [game2, setGame2] = useState<GameObj>();
  const [count1, setCount1] = useState<number>();
  const [count2, setCount2] = useState<number>();
  const [wins, setWins] = useState(0);

  useEffect(() =>{
    if(!games) return;
    let rand1 = Math.floor(Math.random()*games.length);
    let game1 = games[rand1];
    let rand2 = 0;
    let game2;
    while(game2 === undefined || game1.appId === game2.appId) {
      rand2 = Math.floor(Math.random()*games.length);
      game2 = games[rand2];
    }
    console.log(games[rand1])
    games[rand1].hasPlayed = true;
    games[rand2].hasPlayed = true;
    setGame1(game1)
    setGame2(game2)
  }, [])

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-2 justify-center flex flex-col pt-24">
        <Game game={game1} isGuess={false} setCount={setCount1}></Game>
      </div>
      <div className="flex-1 justify-center flex flex-col">
        <Game game={game2} isGuess={true} setCount={setCount2}></Game>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps =  async () => {
  const prisma = new PrismaClient();
    try {
        const games = await prisma.topSteamGames.findFirst();
        if(!games) throw new Error("no games found");
        console.log(games.games);
        let gameArr = JSON.parse(games.games)
        return {
          props: {
            games: gameArr,
            error: null
          }
        }
    } catch (err) {
      return {
        props: {
          games: null,
          error: err
        }
      }
    }
    
}