import { z } from "zod";
import { createRouter } from "../../router/context";
import { Player } from "@prisma/client";

const joinMatch = 
{
  input: z
    .object({
      id: z.string(),
    }),
  async resolve({ input, ctx } : { input: any; ctx: any }) {
    const userId = ctx.session?.id as string;
    if (!userId) return
    let findMatch = await ctx.prisma.match.findUnique({
      where: {
        id: input.id,
      },
      include: {
        player: true,
      }
    })

    // if player already exists return
    if (findMatch?.player.find((player : Player) => {
      return player.userId === userId
    }
    )) {
      return
    }

    if (!findMatch || findMatch.player.length == 2) return

    let player = await ctx.prisma.player.create({
      data: {
        match: {
          connect: {
            id: findMatch.id
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
        score: 0,
        action: [],
      }
    })
    return { findMatch, player }
  },
}
export default joinMatch