
export interface Player {
    id: string;
    name: string;
    action: string;
    score: number;
    status: string;
}
export interface Match {
    id: string;
    player: Player[];
    winner: string;
    loser: string;
    status: string;
    rounds: number;
    createdAt: string;
    updatedAt: string;
}