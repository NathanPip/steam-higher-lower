import Link from "next/link";
import { useEffect, useState } from "react";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  const [isRetry, setIsRetry] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [average, setAverage] = useState<number>();
  const [highestScore, setHighestScore] = useState<number>();

  useEffect(() => {
    fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify(score)
    }).then(res => {
      return res.json()
    }).then(data => {
      setAverage(parseFloat(data.averageScore));
      setHighestScore(parseFloat(data.highestScore));
    }).catch(err => {
      console.log(err);
    })
  }, [])

  return (
    <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-40 animate-fade-in">
      <div className="h-2/3 w-full md:h-96 md:w-72 mx-12 flex flex-col bg-steam items-center justify-around text-3xl rounded-md relative">
        <div className={`${isRetry ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 absolute z-10 bg-top-gradient w-full h-full`}></div>
        <div className={`${isEnd ? "opacity-100" : "opacity-0"} transition-opacity duration-1000 absolute z-10 bg-bottom-gradient w-full h-full`}></div>
        <p className="z-20">
          Your score is
          <span className="block text-center text-5xl mt-2">{score}</span>
        </p>
        {average ? <p className="z-20 animate-fade-in text-base">
          The average score is {average}
        </p> : ""}
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
