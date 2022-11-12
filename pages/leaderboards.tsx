import { GetServerSideProps } from "next";
import { prisma } from "../lib/prisma";
import BackgroundLayout from "../components/BaseLayout/BackgroundLayout";
import { Highscore } from "@prisma/client";

type LeaderBoardProps = {
    leaderBoard: Highscore[];
    error: any;
}

export default function LeaderBoard({leaderBoard}: LeaderBoardProps) {

  return (
    <BackgroundLayout>
      <div className={`transition-opacity duration-1000 mx-auto flex flex-col items-center h-3/4`}>
        <h1 className="w-fit my-9 text-transparent text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-sky-600 to-black">LeaderBoards</h1>
        <ul>
            <li className="text-center">
                <h2 className="text-4xl">Nather</h2>
                scored
                <h3 className="text-6xl">23</h3>
                <p>which has been beaten 2 times matched 1 time and attempted 56 times</p>
            </li>
        </ul>
      </div>
    </BackgroundLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
      let scores = await prisma.highscore.findMany();
      let scoreObjs = scores.map((scoreObj) => {
        const {name, score, attempts, beaten, matched} = scoreObj;
        return {name, score, attempts, beaten, matched};
      })
      scoreObjs = scoreObjs.sort((a,b) => a.score - b.score).reverse();
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