import { PaymentIntent } from "@stripe/stripe-js";
import { CustomDeck } from "./CustomDeck";
import { PokerTableSummary } from "./PokerTableSummary";
import { CustomerAddress } from "./CustomerAddress";

export interface User {
    uid: string
    displayName?: string
    profilePictureUrl?: string
    facilitators?: string[]
    facilitatorsAdmins?: string[]
    canManageFacilitators?: boolean
    facilitatorProvidedByUid?: string
    registeredAt: Date
    customerId?: string
    customerName?: string
    customerEmail?: string
    customerAddress?: CustomerAddress
    customerTaxId?: { value: string }
    customerAcceptedTerms?: string
    customerIsParticular?: boolean
    customDecks?: CustomDeck[]
    votingCount?: number
    totalGamesCreated?: number
    gameHistory?: PokerTableSummary[]
    isPremium?: boolean
    isFacilitator?: boolean
    isSpectator?: boolean
    isTaxExempt?: boolean
    subscriptionStartDate: Date
    subscriptionCurrentPeriodEnd: Date
    subscriptionFacilitatorsQuantity?: number
    subscriptionScheduledQuanity?: number
    subscriptionPriceId?: string
    subscriptionStatus?: 'trialing' | 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
    paymentMethodType?: string
    paymentMethodCardBrand?: string
    paymentMethodCardLast4?: string
    lastFailedPaymentIntent?: PaymentIntent
    readUpdates?: string[]

    utm_source?: string
}