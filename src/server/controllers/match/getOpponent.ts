import { z } from "zod";
import { createRouter } from "../../router/context";

const getOpponent = {
    input: z
      .object({
        id: z.string().nullish(),
      }).nullish(),
    async resolve({ ctx, input }: { ctx: any; input: any }) {
      if (input?.id) {
        const getOpponent = await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          }
        })
        return getOpponent
      }
      return { name: "nothing" }
    }

  }


export default getOpponent