import Link from "next/link";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  return (
    <div className="absolute top-0 left-0 inset-0 bg-zinc-800 bg-opacity-40 flex justify-center items-center z-20">
      <div className="h-96 w-72 flex flex-col items-center justify-around bg-zinc-800 text-3xl rounded-md">
        <p>
          Your score is
          <span className="block text-center text-5xl mt-2">{score}</span>
        </p>
        <div className="flex flex-col items-center w-full">
          <button onClick={onClick} className="bg-red-600 mb-2 w-3/4 h-12 text-center bg-opacity-70 rounded-lg">Retry</button>
          <Link href="/" className="bg-red-600 w-3/4 h-12 text-center rounded-lg flex bg-opacity-70 items-center justify-center">Exit</Link>
        </div>
      </div>
    </div>
  );
}