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
      </div>
    </BackgroundLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
      const scores = await prisma.highscore.findMany();
      return {
        props: {
          leaderBoard: scores,
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