import { FieldValue } from "firebase/firestore";
import { PokerTableSummary } from "./PokerTableSummary";
import { UserMetadata } from "./UserMetadata";

export interface UserServerForUpdate {
    utm_source: string
    utm_medium: string
    utm_campaign: string
    utm_content: string
    utm_term: string

    displayName: string
    profilePictureUrl: string | null
    facilitators: string[]
    facilitatorsAdmins: string[]
    registeredAt: FieldValue
    gameHistory: PokerTableSummary[]

    isSpectator: boolean
    customerAcceptedTerms: string
    readUpdates: FieldValue
    metadata: UserMetadata
}