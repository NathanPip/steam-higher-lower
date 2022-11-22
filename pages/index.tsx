import { type NextPage } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import BackgroundLayout from "../components/BackgroundLayout";


const Home: NextPage = () => {

  const [fadeout, setFadeout] = useState(false);
  const [fadein, setFadein] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadein(false);
    }, 1)
    return () => {
      clearTimeout(timeout);
    }
  }, [])

  return (
    <BackgroundLayout>
      <div className={`${fadeout || fadein ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 mx-auto flex flex-col justify-center items-center max-h-screen`}>
        <h1 className="inline-block w-fit my-5 text-transparent text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-sky-600 to-black">
          Steam
        <span className="md:inline block text-center text-6xl text-white">
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
          className={`bg-gradient-to-br my-2 from-sky-700 to-rose-700 py-2 text-3xl text-white rounded-lg w-full text-center brightness-100 hover:brightness-125 transition-all duration-300`}
          href="/classic"
        >
          Play
        </Link>
        <Link
          onClick={() => {setFadeout(true)}}
          className={`bg-gradient-to-tl from-sky-700 px-4 to-rose-700 py-2 text-3xl text-white rounded-lg w-full text-center brightness-100 hover:brightness-125 transition-all duration-300`}
          href="/leaderboard"
        >
          Leaderboard
        </Link>
        </div>
      </div>
    </BackgroundLayout>
  );
}

export default Home;