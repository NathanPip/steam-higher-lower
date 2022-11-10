import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useEffect, useRef, useState } from "react";
import BackgroundLayout from "../components/BaseLayout/BackgroundLayout";
import EndGame from "../components/EndGame/EndGame";
import Game from "../components/Game/game";
import { delay } from "../lib/helpers";
import { GameObj } from "../lib/steamUtils";

type ClassicProps = {
  games: Array<GameObj>;
}

export type PlayerCount = {
  playerCounts:{[key: string]: number};
}

const Classic = ({ games }: ClassicProps) => {
  const [playables, setPlayables] = useState<Array<GameObj>>();
  const [gameEls, setGameEls] = useState<Array<React.ReactNode>>();
  const [playerCounts, setPlayerCounts] = useState<PlayerCount>({playerCounts:{}});
  const [wins, setWins] = useState(0);
  const [isHigher, setIsHigher] = useState<boolean>();
  const [animationAmt, setAnimationAmt] = useState<number>(0);
  const [displayEndGame, setDisplayEndGame] = useState(false);
  const gameContainer = useRef<HTMLDivElement>(null);

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

  const startGame = () => {
    if (!games) return;
    const newGames = getShuffledGames();
    const game1 = <Game game={newGames[0]} isHigher={setIsHigher} setPlayerCounts={setPlayerCounts} isStart={true} key={0}></Game>;
    const game2 = <Game game={newGames[1]} isHigher={setIsHigher} setPlayerCounts={setPlayerCounts} key={1}></Game>;
    const game3 = <Game game={newGames[2]} isHigher={setIsHigher} setPlayerCounts={setPlayerCounts} key={2}></Game>;
    setGameEls([game1, game2, game3]);
    setPlayables(newGames);
  };

  const handleWin = () => {
    if(!playables) return;
    setAnimationAmt(wins*50+50);
    const newGame = <Game game={playables[wins + 3]} isHigher={setIsHigher} setPlayerCounts={setPlayerCounts} key={wins+3}></Game>;
    setWins(prev => prev+1)
    setGameEls(prev => [...(prev ?? []), newGame]);
  }

  const handleLoss = () => {
    setDisplayEndGame(true);
    setAnimationAmt(0);
  }

  const handleRestart = () => {
    setWins(0)
    setPlayerCounts({playerCounts: {}})
    startGame();
    setDisplayEndGame(false);
  }

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if(isHigher === undefined || !playables) return;
    const prev = playerCounts.playerCounts[playables[wins].appId as keyof PlayerCount];
    const current = playerCounts.playerCounts[playables[wins + 1].appId as keyof PlayerCount];
    if(isHigher && (current > prev) || !isHigher && (current < prev) || current === prev) {
      setIsHigher(undefined);
      handleWin();
    } else {
      setIsHigher(undefined);
      handleLoss();
    }
  }, [isHigher]);

  return (
    <BackgroundLayout>
      <div className="overflow-x-hidden w-screen animate-fade-in">
        <div className="absolute h-screen overflow-x-visible w-2 bg-black z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
          <div className="absolute h-16 w-16 rounded-full bg-black flex justify-center items-center text-2xl">{wins}</div>
        </div>
        <div
          ref={gameContainer}
          className={`h-screen flex justify-between items-center transition-transform duration-1000`}
          style={{transform: `translateX(-${animationAmt}%)`}}
        >
          {gameEls}
        </div>
          {displayEndGame && (
            <EndGame onClick={handleRestart} score={wins}></EndGame>
          )}
      </div>
    </BackgroundLayout>
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

export default Classic;