// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { matchRouter } from "./match";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("match.", matchRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
 