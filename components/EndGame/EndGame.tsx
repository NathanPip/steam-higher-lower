import Link from "next/link";

type EndGameProps = {
  onClick: any;
  score: number;
};

export default function EndGame({ onClick, score }: EndGameProps) {
  return (
    <div className="absolute inset-0 bg-stone-700 bg-opacity-40 flex justify-center items-center">
      <div className="h-64 w-48 flex flex-col items-center justify-around bg-slate-900 text-2xl rounded-md">
        <p>
          Your score is
          <span className="block text-center text-4xl mt-2">{score}</span>
        </p>
        <div className="flex flex-col items-center">
          <button onClick={onClick} className="bg-red-600 mb-2 w-28 h-12 text-center rounded-lg">Retry</button>
          <Link href="/" className="bg-red-600 w-28 h-12 text-center rounded-lg flex items-center justify-center">Exit</Link>
        </div>
      </div>
    </div>
  );
}
