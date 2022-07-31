import { z } from "zod";
import { createRouter } from "../../router/context";

const createMatch = {
    async resolve({ ctx }: { ctx: any }) {
      const userId = ctx.session?.id as string;
      if (!userId) {
        return {
          error: "Not logged in"
        }
      }

      let createMatch = await ctx.prisma.match.create({
        data: {
          title: "Test match",
          winner: "",
          loser: "",
          status: "",
          rounds: 0,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
      createMatch.id
      await ctx.prisma.player.create({
        data: {
          match: {
            connect: {
              id: createMatch.id
            }
          },
          user: {
            connect: {
              id: userId
            }
          },
          score: 0,
          action: "",

        }
      })
      return createMatch
    },
  }


export default createMatch