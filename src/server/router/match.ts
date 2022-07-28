import { createRouter } from "./context";
import { z } from "zod";
import { connect } from "tls";
import { match } from "assert";
import getResults from "../../utils/getResults"



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
  }
  ).query("getMatch", {
    input: z
      .object({
        id: z.string().nullish(),
      }).nullish(),
    async resolve({ ctx, input }) {
      const userId = ctx.session?.id as string;
      let opponent
      let match
      let newMatchObject
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
          let opponentId = await match.player.find((player) => {
            return player.userId !== userId
          })
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
  ).query("getOpponent", {
    input: z
      .object({
        id: z.string().nullish(),
      }).nullish(),
    async resolve({ ctx, input }) {
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
  ).query("getAll", {
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

  }
  ).mutation("getResults", {
    input: z
      .object({
        matchId: z.string(),
      }),
    async resolve({ input, ctx }) {

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
      let winner = ""
      let loser = ""
      let completed = false
      let rounds = 1

      if (currentMatch) {

        results = getResults(currentMatch?.player)

        if (results?.winner) {
          winner = results?.winner
          loser = results?.loser
        }

        let updateResults = await ctx.prisma.match.update({
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
        let updateWinner = await ctx.prisma.player.updateMany({
          where: {
            id: winner ? winner : ""
          },
          data: {
            status: "You Won",
            score: {
              increment: 1
            }
          }
        })

        let updateLoser = await ctx.prisma.player.updateMany({
          where: {
            id: loser ? loser : ""
          },
          data: {
            status: "You Lost",
          }
        })
        return updateResults
      }

    },
  }
  ).mutation("submitAction", {
    input: z
      .object({
        playerId: z.string(),
        action: z.string(),
      }),
    async resolve({ input, ctx }) {
      const userId = ctx.session?.id as string;
      if (!userId) return
      let updateAction = await ctx.prisma.player.update({
        where: {
          id: input.playerId,
        },
        data: {
          action: input.action,
        },
      })
      return updateAction
    },
  }
  ).mutation("join", {
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
        include: {
          player: true,
        }
      })

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
          status: "",
          score: 0,
          action: "",
        }
      })
      return { findMatch, player }
    },
  }
  )