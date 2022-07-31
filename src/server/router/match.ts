import { createRouter } from "./context";
import { z } from "zod";
import getResults from "../../utils/compareActions"
import match from "../controllers/match/index"


export const matchRouter = createRouter()
  .mutation("create", match.createMatch)
  .query("getMatch", match.getMatch)
  .query("getOpponent", match.getOpponent)
  .query("getAll", match.getAll)
  .mutation("getResults", match.getResults)
  .mutation("submitAction", match.submitAction)
  .mutation("join", match.joinMatch)
