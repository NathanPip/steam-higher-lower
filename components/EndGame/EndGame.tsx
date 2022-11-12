import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  const [isRetry, setIsRetry] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [name, setName] = useState("");
  const [average, setAverage] = useState<number>();
  const [highestScore, setHighestScore] = useState<number>();
  const [isHighest, setIsHighest] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>();
  const [id, setId] = useState(uuid());

  const handleSubmit = (e) => {
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
    return;
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
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }, []);

  return (
    <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-40 animate-fade-in">
      <div className="h-2/3 w-full md:max-h-fit md:w-96 mx-12 flex flex-col bg-steam items-center justify-evenly text-3xl rounded-md relative">
        <div
          className={`${isRetry ? "opacity-100" : "opacity-0"} ${
            isHighest ? "opacity-50" : ""
          } transition-opacity duration-1000 absolute z-10 bg-top-gradient w-full h-full`}
        ></div>
        <div
          className={`${isEnd ? "opacity-100" : "opacity-0"} ${
            isHighest ? "opacity-50" : ""
          } transition-opacity duration-1000 absolute z-10 bg-bottom-gradient w-full h-full`}
        ></div>
        <p className="z-20">
          Your score is
          <span className="bg-gradient-to-br from-blue-700 to-red-700 bg-clip-text text-transparent block text-center text-6xl mt-2">{score}</span>
        </p>
        <div className="z-20">
          {average && !isHighest ? (
            <p className="animate-fade-in text-base mb-6">
              The average score is 
              <span className="block text-2xl text-center">{average}</span>
            </p>
          ) : (
            ""
          )}
          {highestScore && !isHighest ? (
            <p className="animate-fade-in text-base text-center">
              The world record is 
              <span className="block text-3xl text-center mb-2">{highestScore}</span>
              can you beat it?
            </p>
          ) : (
            ""
          )}
        </div>
        {isHighest ? (
          <>
            <p className="bg-gradient-to-br from-blue-700 to-red-700 bg-clip-text text-transparent z-20 text-4xl text-center">
              {submitMessage ? submitMessage : "The New World Record!"}
            </p>
            {!submitMessage ? (
              <form
                className="text-xl flex flex-col items-center z-20 w-3/4"
                onSubmit={handleSubmit}
              >
                <input
                  className="text-xl py-1 px-2 rounded-sm w-full text-center bg-zinc-700 relative before:content[''] before:w-full before:h-96 before:absolute before:bg-gradient-to-br before:from-blue-700 before:to-red-700"
                  placeholder="what will you go down as?"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                ></input>
                <button
                  type="submit"
                  className="mt-3 bg-gradient-to-br from-blue-700 to-red-700 p-2 rounded-md w-3/4"
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
            text-2xl rounded-lg transition-all duration-500 shadow-blue-900 
            shadow-sm hover:shadow-md hover:shadow-blue-900 hover:-translate-y-1"
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
            text-2xl transition-all duration-500 items-center justify-center shadow-red-900 
            shadow-sm hover:shadow-md hover:shadow-red-900 hover:-translate-y-1"
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
}
