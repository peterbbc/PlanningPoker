import { PokerTableResults } from "./PokerTableResults";
import { Issue } from "./Issue";

export interface Voting {
    results?: PokerTableResults
    playersVotedTotal?: number
    playersOnlineTotal?: number
    timestamp: Date
    tableDeck?: string[]
    issues?: Issue[]
}