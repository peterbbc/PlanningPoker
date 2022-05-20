import { Timestamp } from "firebase/firestore";
import { Issue } from "./Issue";
import { Player } from "./Player";
import { PokerTableResults } from "./PokerTableResults";
import { WhoCanShowCardsType } from "./WhoCanShowCardsType";
import { WhoCanEditIssuesType } from "./WhoCanEditIssuesType";

export interface PokerTable {
    isFetching: boolean
    isCreating: boolean
    id: string | null
    name?: string
    ownerId: string | null
    players: Player[]
    playersAll: Player[]
    deck: string[]
    issues?: Issue[]
    issuesVotedCount?: number
    createdAt: Timestamp | null
    timerStartedAt?: Date
    timerDurationMinutes?: number
    timerCurrentDurationMinutes?: number
    timerAutoRestart?: number
    results?: PokerTableResults
    cardsUp: boolean | null
    cardsUpCountdown?: number
    isPremium: boolean | null
    isGameOver: boolean | null
    isSomePlayersReachedFreeLimit: boolean | null
    subscriptionCurrentPeriodEnd?: Date
    lastShowCards?: Date
    whoCanShowCards?: WhoCanShowCardsType
    whoCanEditIssues?: WhoCanEditIssuesType
    votingCountdown?: number
    votingCount?: number
}
