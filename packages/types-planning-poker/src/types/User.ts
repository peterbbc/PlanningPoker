import { PokerTableSummary } from "./PokerTableSummary";

export interface User {
    uid: string
    displayName?: string
    facilitators?: any[]
    registeredAt: Date
    subscriptionStartDate: Date
    subscriptionCurrentPeriodEnd: Date
    subscriptionFacilitatorsQuantity?: number
    customDecks?: string[][]
    gameHistory?: PokerTableSummary[]
    isPremium?: boolean
    isFacilitator?: boolean
    isTaxExempt?: boolean
    subscriptionPriceId?: string
    subscriptionStatus?: 'trialing' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
}