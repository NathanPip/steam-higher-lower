import { GetServerSideProps } from "next";
import Game from "../components/game/game";

export default function Classic() {



  return (
    <div className="h-screen flex flex-col">
      <div className="flex-2 justify-center flex flex-col pt-24">
        <Game game={{ title: "asdas", playerCount: 299 }} isGuess={false}></Game>
      </div>
      <div className="flex-1 justify-center flex flex-col">
        <Game game={{ title: "tyrghr", playerCount: 5234 }} isGuess={true}></Game>
      </div>
    </div>
  );
}

// export const getServerSideProps: GetServerSideProps =  async () => {

// }