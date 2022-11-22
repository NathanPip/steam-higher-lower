import { router } from "../trpc";
import { highscoreRouter } from "./highscore";
import { scoreRouter } from "./score";

export const appRouter = router({
  highscore: highscoreRouter,
  scores: scoreRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
