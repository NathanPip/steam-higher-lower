import Link from "next/link";
import BaseLayout from "../components/BaseLayout/BaseLayout";

const wordGradient = "text-transparent bg-clip-text";

export default function Home() {
  return (
    <BaseLayout>
      <div className="mx-auto flex flex-col justify-center items-center h-3/4">
        <h1 className="my-9 text-transparent text-8xl bg-clip-text bg-gradient-to-br from-blue-50 via-blue-600 to-black">
          Steam
          <span className="inline-block text-6xl text-white">
            Charts
          </span>
        </h1>
        <h2 className="text-6xl my-20 py-4 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-600">
            Higher
          </span>
          <span className="block mt-6 text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-gray-700">
            Lower
          </span>
        </h2>
        <Link
          className={`transition-all bg-gradient-to-br from-blue-600 to-black hover:bg-gradient-to-tl py-2 text-3xl text-white rounded-lg w-40 text-center`}
          href="/classic"
        >
          Play
        </Link>
      </div>
    </BaseLayout>
  );
}
