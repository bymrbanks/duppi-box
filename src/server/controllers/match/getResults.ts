import { z } from "zod";
import { createRouter } from "../../router/context";
import compareActions from "../../../utils/compareActions"
const getResults = {
    input: z
      .object({
        matchId: z.string(),
      }),
    async resolve({ input, ctx } : { input: any; ctx: any }) {

      const userId = ctx.session?.id as string;
      if (!userId) return

      let currentMatch = await ctx.prisma.match.findUnique({
        where: {
          id: input.matchId,
        },
        include: {
          player: true
        }
      })

      let results
      let winner: string | null
      let loser: string | null
      let rounds: number = currentMatch?.rounds ?? 0

      if (currentMatch) {
        results = compareActions(currentMatch?.player, rounds)
        if (currentMatch?.player[0]?.score as number === 3 || currentMatch?.player[1]?.score as number === 3) {
          return
        }
        if (!currentMatch?.player[0]?.action[rounds] || !currentMatch?.player[1]?.action[rounds]) {
          return
        }


        if (results?.winner && results?.loser) {
          winner = results?.winner
          loser = results?.loser
        } else {
          winner = "TIE"
          loser = "TIE"
        }



        let updateResults: any = await ctx.prisma.match.update({
          where: {
            id: input.matchId,
          },
          data: {
            winner: winner,
            loser: loser,
            rounds: {
              increment: 1,
            },
          },
        },
        )

        if (winner == "TIE" || loser == "TIE") return
        await ctx.prisma.player.updateMany({
          where: {
            id: winner ? winner : ""
          },
          data: {
            score: {
              increment: 1
            },
            rounds: {
              push: false
            }
          }
        })

        await ctx.prisma.player.updateMany({
          where: {
            id: loser ? loser : ""
          },
          data: {
            rounds: {
              push: false
            }

          }
        })

        return updateResults
      }

    },
  }


export default getResults