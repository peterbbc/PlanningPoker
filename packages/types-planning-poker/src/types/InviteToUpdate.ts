import { Timestamp } from "firebase/firestore";

export interface InviteToUpdate {
    email: string
    premiumUserId: string,
    premiumUserName?: string,
    creatorUserId: string,
    creatorUserName: string,
    canManageFacilitators: boolean
    status: 'PENDING' | 'ACCEPTED',
    createdAt: Timestamp,
}
