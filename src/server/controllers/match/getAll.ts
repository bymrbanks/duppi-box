import { z } from "zod";
import { createRouter } from "../../router/context";

const getAll = {
    async resolve({ ctx }: { ctx: any }) {
      const userId = ctx.session?.id as string;
      if (!userId) return
      let matches = await ctx.prisma.match.findMany({
        include: {
          player: {
            where: {
              user: {
                id: userId
              }
            }
          },
        },
      });
      console.log(matches)
      return matches
    },

  }


export default getAll