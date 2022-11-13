import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import EndGame from "../components/EndGame";
import Game from "../components/Game";
import { delay } from "../lib/helpers";
import { GameObj } from "../lib/steamUtils";

type ClassicProps = {
  games: Array<GameObj>;
};

export type PlayerCount = {
  playerCounts: { [key: string]: number };
};

const Classic = ({ games }: ClassicProps) => {
  const [playables, setPlayables] = useState<Array<GameObj>>();
  const [gameEls, setGameEls] = useState<Array<React.ReactNode>>();
  const [playerCounts, setPlayerCounts] = useState<PlayerCount>({
    playerCounts: {},
  });
  const [wins, setWins] = useState(0);
  const [isHigher, setIsHigher] = useState<boolean>();
  const [animationAmt, setAnimationAmt] = useState<number>(0);
  const [displayEndGame, setDisplayEndGame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const gameContainer = useRef<HTMLDivElement>(null);

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
  };
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const getShuffledGames = useCallback(() => {
    let tempGames = [...games];
    let newGames = [];
    while (tempGames.length) {
      let rand = Math.floor(Math.random() * tempGames.length);
      newGames.push(tempGames[rand]);
      tempGames.splice(rand, 1);
    }
    return newGames;
  }, [games]);

  const startGame = useCallback(() => {
    if (!games) return;
    const newGames = getShuffledGames();
    const game1 = (
      <Game
        game={newGames[0]}
        isHigher={setIsHigher}
        setPlayerCounts={setPlayerCounts}
        isStart={true}
        key={0}
      ></Game>
    );
    const game2 = (
      <Game
        game={newGames[1]}
        isHigher={setIsHigher}
        setPlayerCounts={setPlayerCounts}
        key={1}
      ></Game>
    );
    const game3 = (
      <Game
        game={newGames[2]}
        isHigher={setIsHigher}
        setPlayerCounts={setPlayerCounts}
        key={2}
      ></Game>
    );
    setGameEls([game1, game2, game3]);
    setPlayables(newGames);
  }, [games, getShuffledGames]);

  const handleWin = async () => {
    if (!playables) return;
    await delay(400);
    setAnimationAmt(wins * 50 + 50);
    const newGame = (
      <Game
        game={playables[wins + 3]}
        isHigher={setIsHigher}
        setPlayerCounts={setPlayerCounts}
        key={wins + 3}
      ></Game>
    );
    setWins((prev) => prev + 1);
    setGameEls((prev) => [...(prev ?? []), newGame]);
  };

  const handleLoss = async () => {
    await delay(750);
    setDisplayEndGame(true);
    await delay(250);
    setAnimationAmt(0);
  };

  const handleRestart = () => {
    setWins(0);
    setPlayerCounts({ playerCounts: {} });
    startGame();
    setDisplayEndGame(false);
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (isHigher === undefined || !playables) return;
    const prev =
      playerCounts.playerCounts[playables[wins].appId as keyof PlayerCount];
    const current =
      playerCounts.playerCounts[playables[wins + 1].appId as keyof PlayerCount];
    if (
      (isHigher && current > prev) ||
      (!isHigher && current < prev) ||
      current === prev
    ) {
      setIsHigher(undefined);
      handleWin();
    } else {
      setIsHigher(undefined);
      handleLoss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHigher]);

  return (
    <BackgroundLayout>
      <div className="overflow-hidden w-screen h-screen animate-fade-in">
        <Link href="/" className="fixed text-2xl top-0 left-0 m-3 bg-gradient-to-br from-blue-700 to-rose-700 p-2 rounded-md z-10">
          Quit
        </Link>
        <div className="absolute h-16 w-16 rounded-full bg-white text-black flex justify-center items-center text-4xl top-1/2 md:top-16 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {wins}
        </div>
        <div
          ref={gameContainer}
          className={`md:h-screen flex flex-col md:flex-row md:items-center transition-transform duration-1000`}
          style={{
            transform: `${
              isMobile
                ? `translateY(-${animationAmt}vh)`
                : `translateX(-${animationAmt}%)`
            }`,
          }}
        >
          {gameEls}
        </div>
        {displayEndGame && (
          <EndGame onClick={handleRestart} score={wins}></EndGame>
        )}
      </div>
    </BackgroundLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
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
