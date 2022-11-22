import { router } from "../trpc";
import { highscoreRouter } from "./highscore";

export const appRouter = router({
  highscore: highscoreRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
