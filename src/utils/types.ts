
export interface Player {
    id: string;
    name: string;
    action: string;
    score: number;
}
export interface Match {
    id: string;
    player_1_id: Player;
    player_2_id: Player;
    winner: string;
    loser: string;
    status: string;
    rounds: number;
    createdAt: string;
    updatedAt: string;
}