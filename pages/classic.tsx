import type { GetServerSideProps, NextPage } from "next";
import { prisma } from "../server/db/client";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackgroundLayout from "../components/BackgroundLayout";
import EndGame from "../components/EndGame";
import Game from "../components/Game";
import { delay } from "../utils/helpers";
import type { GameObj } from "../utils/steamUtils";
import { v4 as uuid } from "uuid";
import { trpc } from "../utils/trpc";

type ClassicProps = {
  games: Array<GameObj> | null;
  error: string | null;
};

export type PlayerCount = {
  playerCounts: { [key: string]: number };
};

const Classic: NextPage<ClassicProps> = ({ games, error }) => {
  const [playables, setPlayables] = useState<Array<GameObj>>();
  const [gameEls, setGameEls] = useState<Array<React.ReactNode>>();
  const [wins, setWins] = useState(0);
  const [isHigher, setIsHigher] = useState<boolean>();
  const [animationAmt, setAnimationAmt] = useState<number>(0);
  const [displayEndGame, setDisplayEndGame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [id, setId] = useState(uuid());
  const gameContainer = useRef<HTMLDivElement>(null);
  const scores = trpc.scores.getScores.useQuery()
  const scoreMutation = trpc.scores.postScores.useMutation()

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
    if (!games) return;
    const tempGames = [...games];
    const newGames: GameObj[] = [];
    while (tempGames.length) {
      const rand = Math.floor(Math.random() * tempGames.length);
      const randGame = tempGames[rand];
      randGame && newGames.push(randGame);
      tempGames.splice(rand, 1);
    }
    return newGames;
  }, [games]);

  const startGame = useCallback(() => {
    if (!games) return;
    const newGames = getShuffledGames();
    if (!newGames) return;
    const game1 = (
      <Game
        game={newGames[0]}
        isHigher={setIsHigher}
        isStart={true}
        key={0}
      ></Game>
    );
    const game2 = (
      <Game game={newGames[1]} isHigher={setIsHigher} key={1}></Game>
    );
    const game3 = (
      <Game game={newGames[2]} isHigher={setIsHigher} key={2}></Game>
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
        key={wins + 3}
      ></Game>
    );
    setWins((prev) => prev + 1);
    setGameEls((prev) => [...(prev ?? []), newGame]);
  };

  const handleLoss = async () => {
    scores.refetch();
    setDisplayEndGame(true);
    scoreMutation.mutate({ id, score: wins });
    await delay(250);
    setAnimationAmt(0);
  };

  const handleRestart = () => {
    setWins(0);
    setId(uuid());
    startGame();
    setDisplayEndGame(false);
  };

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (isHigher === undefined || !playables) return;
    const prev = playables[wins]?.playerCount || 0;
    const current = playables[wins + 1]?.playerCount || 0;
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
      {error && "It seems there was an error"}
      <div className="overflow-hidden w-screen h-screen animate-fade-in">
        <Link
          href="/"
          className="fixed text-2xl top-0 left-0 m-3 bg-gradient-to-br from-blue-700 to-rose-700 p-2 rounded-md z-10 brightness-100 hover:brightness-125 transition-all duration-300"
        >
          Quit
        </Link>
        <div className="absolute h-24 w-24 rounded-full bg-[#171A21] flex justify-center items-center text-6xl top-1/2 md:top-16 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="bg-gradient-to-br from-blue-700 to-rose-700 bg-clip-text text-transparent">{wins}</p>
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
          <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-40 animate-fade-in">
            {scores.data && (
              <EndGame
                handleRestart={handleRestart}
                score={wins}
                scoreData={scores.data}
                id={id}
              ></EndGame>
            )}
            {scores.error && (
              <>{scores.error.message}</>
            )}
          </div>
        )}
      </div>
    </BackgroundLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const games = await prisma.steamGame.findMany({
      where: {
        playerCount: {
          gt: 0,
        },
      },
    });
    if (!games) throw new Error("no games found");
    const gameArr = games.map((game) => {
      return {
        id: game.id,
        title: game.title,
        playerCount: game.playerCount,
        appId: game.appId,
      };
    });
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
        error: "Something went wrong",
      },
    };
  }
};

export default Classic;
