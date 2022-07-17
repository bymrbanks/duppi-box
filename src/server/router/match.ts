import { createRouter } from "./context";
import { z } from "zod";
import { connect } from "tls";

export const matchRouter = createRouter()
  .mutation("create", {
    async resolve({ ctx }) {
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
          status: "",
          score: 0,
          action: "",

        }
      })
      return createMatch
    },
  })
  .query("getMatch", {
    input: z
      .object({
        id: z.string().nullish(),
      }).nullish(),
    async resolve({ ctx, input }) {
      const userId = ctx.session?.id as string;
      if (!userId) {
        return {
          error: "Not logged in"
        }
      }
      if (input?.id) {
        const match = await ctx.prisma.match.findUnique({
          where: {
            id: input?.id,
          },
          include: {
            player: true,
          }
        })
        return match
      }
    }
  }).query("getAll", {
    async resolve({ ctx }) {
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
  }).mutation("join", {
    input: z
      .object({
        id: z.string(),
      }),
    async resolve({ input, ctx }) {
      const userId = ctx.session?.id as string;
      if (!userId) return
      let findMatch = await ctx.prisma.match.findUnique({
        where: {
          id: input.id,
        },
      })
      if (!findMatch) return
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
          status: "",
          score: 0,
          action: "",
        }
      })
      return { findMatch, player }
    },
  })