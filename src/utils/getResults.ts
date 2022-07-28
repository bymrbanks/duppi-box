import { Player } from "@prisma/client";
const ACTIONS = (action: string) => {
    if (action === "ROCK") return "PAPER";
    if (action === "PAPER") return "SCISSORS";
    if (action === "SCISSORS") return "ROCK";
};

function getResults(players: Player[]) {
    let player1 = players[0]
    let player2 = players[1]

    if (!player1?.action || !player2?.action) return

    if (player1.action === player2.action) {
        return {
            winner: null,
            loser: null
        }
    } else if (ACTIONS(player1.action) === player2.action) {
        return {
            winner: player1.id,
            loser: player2.id
        }
    } else if (ACTIONS(player2.action) === player1.action) {
        return {
            winner: player2.id,
            loser: player1.id,
        }
    }
}

export default getResults