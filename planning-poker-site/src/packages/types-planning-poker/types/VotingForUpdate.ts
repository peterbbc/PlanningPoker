import { FieldValue, Timestamp } from "firebase/firestore";
import { PokerTableResults } from "./PokerTableResults";
import { Issue } from "./Issue";
import { WhoCanShowCardsType } from "./WhoCanShowCardsType";

export interface VotingForUpdate {
    timestamp: FieldValue
    tableId: string | null
    tableOwnerId: string | null
    tableCreatedAt: string
    tableVotingCount?: number
    tableVotingCountdown?: number
    tablePlayersAll: string[]
    tablePlayersAllTotal: number
    tableWhoCanShowCards?: WhoCanShowCardsType
    tableDeck: string[]
    tableIsPremium: boolean | null
    milisecondsPassedSinceLastShowCards: number | null
    playersOnline: string[]
    playersOnlineTotal: number
    playersVoted: string[]
    playersVotedTotal: number
    results: PokerTableResults | null
    issues: Issue[] | null
}