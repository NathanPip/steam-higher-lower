import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import profanity from "../utils/profanity";
import { trpc } from "../utils/trpc";

type ScoreData = {
  averageScore: number;
  highestScore: number;
};

type EndGameProps = {
  handleRestart: () => void;
  score: number;
  scoreData: ScoreData;
  id: string;
};

const EndGame: React.FC<EndGameProps> = ({
  handleRestart,
  score,
  scoreData,
  id,
}) => {
  const [isRetry, setIsRetry] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [name, setName] = useState("");
  const [isHighest] = useState(score > scoreData.highestScore);
  const input = useRef<HTMLInputElement>(null);
  const highscoreMutation = trpc.highscore.newHighscore.useMutation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isHighest || !name) return;
    const isProfane: boolean = profanity.exists(name);
    if (!isProfane) {
      highscoreMutation.mutate({ name: name, id: id });
    }
  };

  return (
    <div className="w-full md:max-h-fit md:w-96 mx-12 flex flex-col bg-steam items-center justify-evenly text-3xl rounded-md relative animate-fade-in">
      <div
        className={`${isRetry ? "opacity-100" : "opacity-0"} ${
          isHighest ? "opacity-50" : ""
        } transition-opacity duration-1000 absolute z-10 bg-retry-gradient w-full h-full`}
      ></div>
      <div
        className={`${isEnd ? "opacity-100" : "opacity-0"} ${
          isHighest ? "opacity-50" : ""
        } transition-opacity duration-1000 absolute z-10 bg-end-gradient w-full h-full`}
      ></div>
      <p className="z-20 pt-4">
        Your score is
        <span className="bg-gradient-to-br from-blue-700 to-rose-700 bg-clip-text text-transparent block text-center text-8xl mt-2">
          {score}
        </span>
      </p>
      <div className="z-20">
        {scoreData.highestScore && !isHighest ? (
          <p className="animate-fade-in text-base text-center">
            The world record is
            <span className="block text-6xl text-center mb-2">
              {scoreData.highestScore}
            </span>
            can you beat it?
          </p>
        ) : (
          ""
        )}
        {scoreData.averageScore && !isHighest ? (
          <p className="animate-fade-in text-base mt-6">
            The average score is {scoreData.averageScore}
          </p>
        ) : (
          ""
        )}
      </div>
      {isHighest ? (
        <>
          <p className="bg-gradient-to-br from-blue-700 to-rose-700 bg-clip-text text-transparent z-20 text-4xl text-center">
            {highscoreMutation.data && !highscoreMutation.error
              ? highscoreMutation.data
              : "The New World Record!"}
            {highscoreMutation.error && "Looks like something went wrong"}
          </p>
          {!highscoreMutation.data ? (
            <form
              className="text-xl flex flex-col items-center z-20 w-3/4"
              onSubmit={handleSubmit}
            >
              <input
                className="text-xl py-1 px-2 rounded-md w-full text-center bg-zinc-700 relative"
                placeholder="what will you go down as?"
                value={name}
                ref={input}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              ></input>
              <button
                type="submit"
                className="mt-3 bg-gradient-to-br from-blue-700 to-rose-700 p-2 rounded-md w-3/4"
              >
                Submit
              </button>
            </form>
          ) : (
            ""
          )}{" "}
        </>
      ) : (
        ""
      )}
      <div className="flex flex-col z-20 items-center w-full my-6">
        <button
          onMouseEnter={() => {
            setIsRetry(true);
          }}
          onMouseLeave={() => {
            setIsRetry(false);
          }}
          onClick={handleRestart}
          className="mb-4 w-3/4 py-2 text-center bg-opacity-50 bg-zinc-800 
            text-2xl rounded-lg transition-all duration-500
            shadow-retry hover:shadow-retryHover hover:shadow-blue-900 hover:-translate-y-1"
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
          className="w-3/4 py-2 text-center rounded-lg flex bg-opacity-50 bg-zinc-800 
            text-2xl transition-all duration-500 items-center justify-center shadow-rose-900 
            shadow-end hover:shadow-endHover hover:shadow-rose-900 hover:-translate-y-1"
        >
          Exit
        </Link>
      </div>
    </div>
  );
};

export default EndGame;
