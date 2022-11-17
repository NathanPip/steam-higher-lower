import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import BackgroundLayout from "../components/BackgroundLayout";
import { Highscore } from "@prisma/client";
import Link from "next/link";

type LeaderBoardProps = {
  leaderBoard: Highscore[] | null;
  error: any | null;
};

export default function LeaderBoard({ leaderBoard, error }: LeaderBoardProps) {
  console.log(error);
  return (
    <BackgroundLayout>
      <div
        className={`transition-opacity duration-1000 mx-auto flex flex-col items-center h-3/4 animate-fade-in`}
      >
        <Link
          className="fixed text-2xl top-0 left-0 m-3 bg-gradient-to-br from-blue-700 to-rose-700 p-2 rounded-md brightness-100 hover:brightness-125 transition-all duration-300"
          href="/"
        >
          Back
        </Link>
        <h1 className="w-fit my-12 mt-16 text-transparent text-6xl lg:text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-sky-600 to-black">
          LeaderBoards
        </h1>
        <ul>
          {leaderBoard &&
            leaderBoard.map((score, index) => {
              return (
                <li className="text-center bg-zinc-800 bg-opacity-30 rounded-lg p-4 my-6 w-96 max-w-full" key={index}>
                  <h2 className="text-4xl mb-6">{score.name}</h2>
                  <div className="flex items-center justify-around">
                    <h3 className="text-7xl bg-gradient-to-br from-sky-500 to-rose-700 bg-clip-text text-transparent">
                      <span className="block text-base">score</span>
                      {score.score}
                    </h3>
                    <p className="block">
                      beaten{" "}
                      <span className="text-sky-500 text-xl">
                        {" "}
                        {score.beaten}{" "}
                      </span>{" "}
                      times <br />
                      matched{" "}
                      <span className="text-purple-500 text-xl">
                        {" "}
                        {score.matched}{" "}
                      </span>{" "}
                      times <br />
                      attempted{" "}
                      <span className="text-rose-500 text-xl">
                        {score.attempts}
                      </span>{" "}
                      times
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
        {error && "It seems there was an error"}
      </div>
    </BackgroundLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    let scores = await prisma.highscore.findMany();
    let scoreObjs = scores.map((scoreObj) => {
      const { name, score, attempts, beaten, matched } = scoreObj;
      return { name, score, attempts, beaten, matched };
    });
    scoreObjs = scoreObjs.sort((a, b) => a.score - b.score).reverse();
    return {
      props: {
        leaderBoard: scoreObjs,
        error: null,
      },
    };
  } catch (err) {
    return {
      props: {
        leaderBoard: null,
        error: err,
      },
    };
  }
};
