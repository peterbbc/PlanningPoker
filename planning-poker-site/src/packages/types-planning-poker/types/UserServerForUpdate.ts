import { FieldValue } from "firebase/firestore";
import { PokerTableSummary } from "./PokerTableSummary";
import { UserMetadata } from "./UserMetadata";

export interface UserServerForUpdate {
    utm_source: string | null
    utm_medium: string | null
    utm_campaign: string | null
    utm_content: string | null
    utm_term: string | null

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