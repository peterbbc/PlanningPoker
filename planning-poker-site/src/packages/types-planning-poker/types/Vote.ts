import { Player } from "./Player";

export interface Vote {
    card: any
    playersVoted: Player[]
    totalVotes: number
}