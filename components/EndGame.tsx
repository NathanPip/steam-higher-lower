import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  const [isRetry, setIsRetry] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [average, setAverage] = useState<number>();
  const [highestScore, setHighestScore] = useState<number>();
  const [isHighest, setIsHighest] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>();
  const [id, setId] = useState(uuid());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isHighest || !name) return;
    fetch("/api/highscore", {
      method: "POST",
      body: JSON.stringify({ name, id }),
    })
      .then(() => {
        setSubmitMessage("You're in the books");
      })
      .catch(() => {
        setSubmitMessage("Something went wrong");
      });
  };

  useEffect(() => {
    setLoading(true)
    fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ score, id }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAverage(parseFloat(data.averageScore));
        setHighestScore(parseFloat(data.highestScore));
        setIsHighest(data.isHighest);
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      });
    return;
  }, [score, id]);

  return (
    <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-40 animate-fade-in">
      {!loading ? 
      <div className="h-2/3 w-full md:max-h-fit md:w-96 mx-12 flex flex-col bg-steam items-center justify-evenly text-3xl rounded-md relative animate-fade-in">
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
        <p className="z-20">
          Your score is
          <span className="bg-gradient-to-br from-blue-700 to-rose-700 bg-clip-text text-transparent block text-center text-8xl mt-2">{score}</span>
        </p>
        <div className="z-20">
        {highestScore && !isHighest ? (
            <p className="animate-fade-in text-base text-center">
              The world record is 
              <span className="block text-6xl text-center mb-2">{highestScore}</span>
              can you beat it?
            </p>
          ) : (
            ""
          )}
          {average && !isHighest ? (
            <p className="animate-fade-in text-base mt-6">
              The average score is {average}
            </p>
          ) : (
            ""
          )}
        </div>
        {isHighest ? (
          <>
            <p className="bg-gradient-to-br from-blue-700 to-rose-700 bg-clip-text text-transparent z-20 text-4xl text-center">
              {submitMessage ? submitMessage : "The New World Record!"}
            </p>
            {!submitMessage ? (
              <form
                className="text-xl flex flex-col items-center z-20 w-3/4"
                onSubmit={handleSubmit}
              >
                <input
                  className="text-xl py-1 px-2 rounded-md w-full text-center bg-zinc-700 relative"
                  placeholder="what will you go down as?"
                  value={name}
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
        <div className="flex flex-col z-20 items-center w-full">
          <button
            onMouseEnter={() => {
              setIsRetry(true);
            }}
            onMouseLeave={() => {
              setIsRetry(false);
            }}
            onClick={onClick}
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
      : "" }
    </div>
  );
}
