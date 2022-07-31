import { Player } from "@prisma/client";
const ACTIONS = (action: string) => {
    if (action === "ROCK") return "PAPER";
    if (action === "PAPER") return "SCISSORS";
    if (action === "SCISSORS") return "ROCK";
};

function compareActions(players: Player[], rounds: number) {
    let round = rounds - 1
    let player1 = players[0]?.action[round] ?? "";
    let player2 = players[1]?.action[round] ?? "";

    if (!player1 || !player2) return

    if (player1 === player2) {
        return {
            winner: null,
            loser: null
        }
    } else if (ACTIONS(player1) === player2) {
        return {
            winner: players[0]?.id,
            loser: players[1]?.id
        }
    } else if (ACTIONS(player2) === player1) {
        return {
            winner: players[0]?.id,
            loser: players[1]?.id
        }
    }
}

export default compareActions