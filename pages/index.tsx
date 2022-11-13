import Link from "next/link";
import { useEffect, useState } from "react";
import BackgroundLayout from "../components/BackgroundLayout";


export default function Home() {

  const [fadeout, setFadeout] = useState(false);
  const [fadein, setFadein] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFadein(false);
    }, 1)
  }, [])

  return (
    <BackgroundLayout>
      <div className={`${fadeout || fadein ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 mx-auto flex flex-col justify-center items-center h-3/4`}>
        <h1 className="inline-block w-fit my-9 text-transparent text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-sky-600 to-black">
          Steam
        <span className="inline text-6xl text-white">
          Charts
        </span>
        </h1>
        <h2 className="text-6xl my-20 py-4 text-center">
          <span className="text-white border-t-2 border-sky-600">
            Higher
          </span>
          <span className="block mt-6 pb-2 text-white border-b-2 border-rose-600">
            Lower
          </span>
        </h2>
        <div className="w-84 grid ">
        <Link
          onClick={() => {setFadeout(true)}}
          className={`bg-gradient-to-br my-2 from-sky-700 to-rose-700 py-2 text-3xl text-white rounded-lg w-full text-center`}
          href="/classic"
        >
          Play
        </Link>
        <Link
          onClick={() => {setFadeout(true)}}
          className={`bg-gradient-to-tl from-sky-700 px-4 to-rose-700 py-2 text-3xl text-white rounded-lg w-full text-center`}
          href="/leaderboard"
        >
          Leaderboard
        </Link>
        </div>
      </div>
    </BackgroundLayout>
  );
}
