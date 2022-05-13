import { Timestamp } from "firebase/firestore";
import { PokerTableResults } from "./PokerTableResults";
import { Issue } from "./Issue";

export interface VotingForUpdate {
    timestamp: Timestamp,
    tableId: string,
    tableOwnerId: string,
    tableCreatedAt: string
    tableVotingCount: number,
    tableVotingCountdown: number,
    tablePlayersAll: string[],
    tablePlayersAllTotal: number,
    tableWhoCanShowCards: string[],
    tableDeck: string[],
    tableIsPremium: boolean,
    milisecondsPassedSinceLastShowCards: number | null,
    playersOnline: string[],
    playersOnlineTotal: number,
    playersVoted: string[],
    playersVotedTotal: number,
    results: PokerTableResults | null
    issues: Issue[] | null,
}