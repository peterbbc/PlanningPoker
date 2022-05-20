import { Timestamp } from "firebase/firestore"

export interface PokerTableServer {
    votingCountdown: number
    timerStartedAt?: Timestamp
    lastShowCards?: Timestamp
    subscriptionCurrentPeriodEnd?: Timestamp
    playersThatReachedLimit?: any[]
}