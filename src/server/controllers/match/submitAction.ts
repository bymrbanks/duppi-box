import { z } from "zod";
import { createRouter } from "../../router/context";

const SubmitAction = {
    input: z
      .object({
        playerId: z.string(),
        action: z.string(),
        matchId: z.string(),
      }),

    async resolve({ input, ctx } : { input: any; ctx: any }) {

      const userId = ctx.session?.id as string;
      if (!userId && !input.matchId) return
      let match = await ctx.prisma.match.findUnique({
        where: {
          id: input.matchId,
        },
        include: {
          player: true,
        }
      })

      if (!match) return false
      if (match?.player[0]?.action.length != (match?.rounds as number) && match?.player[1]?.action.length != (match?.rounds as number)) return
      if (match?.player[0]?.score === 3 || match?.player[1]?.score === 3) return
     

      await ctx.prisma.player.update({
        where: {
          id: input.playerId,
        },
        data: {
          action: {
            push: input.action
          },
        },
      })

      return true
    },
  }



export default SubmitAction