import Link from "next/link";
import { useEffect, useState } from "react";
import BackgroundLayout from "../components/BaseLayout/BackgroundLayout";


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
        <h1 className="inline-block w-fit my-9 text-transparent text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-blue-600 to-black">
          Steam
        <span className="inline text-6xl text-white">
          Charts
        </span>
        </h1>
        <h2 className="text-6xl my-20 py-4 text-center">
          <span className="text-white border-t-2 border-blue-600">
            Higher
          </span>
          <span className="block mt-6 pb-2 text-white border-b-2 border-red-600">
            Lower
          </span>
        </h2>
        <Link
          onClick={() => {setFadeout(true)}}
          className={`bg-gradient-to-br from-blue-700 to-red-700 py-2 text-3xl text-white rounded-lg w-40 text-center`}
          href="/classic"
        >
          Play
        </Link>
      </div>
    </BackgroundLayout>
  );
}
