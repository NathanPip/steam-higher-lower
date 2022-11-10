import Link from "next/link";
import { useState } from "react";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  const [isRetry, setIsRetry] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-40">
      <div className="h-96 w-72 flex flex-col bg-steam items-center justify-around text-3xl rounded-md relative">
        <div className={`${isRetry ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 absolute z-10 bg-top-gradient w-full h-full`}></div>
        <div className={`${isEnd ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 absolute z-10 bg-bottom-gradient w-full h-full`}></div>
        <p className="z-20">
          Your score is
          <span className="block text-center text-5xl mt-2">{score}</span>
        </p>
        <div className="flex flex-col z-20 items-center w-full">
          <button
            onMouseEnter={() => {
              setIsRetry(true);
            }}
            onMouseLeave={() => {
              setIsRetry(false);
            }}
            onClick={onClick}
            className="mb-4 w-3/4 py-2 text-center bg-opacity-50 bg-zinc-800 text-2xl rounded-lg transition-all duration-500 shadow-blue-900 shadow-sm hover:shadow-md hover:shadow-blue-900 hover:-translate-y-1"
          >
            Retry
          </button>
          <Link
            onMouseEnter={() => {
              setIsEnd(true);
            }}
            onMouseLeave={() => {
              setIsEnd(false);
            }}
            href="/"
            className="w-3/4 py-2 text-center rounded-lg flex bg-opacity-50 bg-zinc-800 text-2xl transition-all duration-500 items-center justify-center shadow-red-900 shadow-sm hover:shadow-md hover:shadow-red-900 hover:-translate-y-1"
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
}
