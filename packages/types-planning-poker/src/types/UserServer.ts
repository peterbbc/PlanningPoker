import { Timestamp } from "firebase/firestore";

export interface UserServer {
    displayName?: string
    registeredAt?: Timestamp
    subscriptionStartDate?: Timestamp
    subscriptionCurrentPeriodEnd?: Timestamp
    subscriptionId?: string
    customerTaxExempt?: 'exempt' | 'reverse'
    facilitators?: any[]
    isFacilitator?: boolean
}