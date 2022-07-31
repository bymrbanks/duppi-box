import { z } from "zod";
import { createRouter } from "../../router/context";
import { Player } from "@prisma/client";
const getMatch = {
    input: z
      .object({
        id: z.string().nullish(),
      }).nullish(),
    async resolve({ ctx, input }: { ctx: any; input: any }) {
      const userId = ctx.session?.id as string;
      let opponent
      let match
      if (input?.id) {
        match = await ctx.prisma.match.findUnique({
          where: {
            id: input?.id,
          },
          include: {
            player: true,
          }
        })

        if (match?.id) {
          let opponentId = await match.player.find((player:Player) => {
            return player.userId !== userId
          })
          console.log(match.id)
          if (opponentId) {
            opponent = await ctx.prisma.user.findUnique({
              where: {
                id: opponentId.userId
              }
            })
          }
        }

        return { ...match, opponent: opponent ? opponent : null }
      }
    }
  }


export default getMatch