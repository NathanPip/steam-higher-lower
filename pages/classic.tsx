import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import Game from "../components/game/game";
import { GameObj } from "../lib/steamUtils";

export default function Classic({games}: {games: Array<GameObj>}) {

  useEffect(() =>{
    console.log(games);
  })

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-2 justify-center flex flex-col pt-24">
        <Game game={{ title: "asdas", playerCount: 299 }} isGuess={false}></Game>
      </div>
      <div className="flex-1 justify-center flex flex-col">
        <Game game={{ title: "tyrghr", playerCount: 5234 }} isGuess={true}></Game>
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
        return {
          props: {
            games: games.games,
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