export interface Invite {
    id: string
    link: string
    email: string
    canManageFacilitators: boolean
    creatorUserName: string
    status: 'PENDING' | 'ACCEPTED'
    premiumUserId: string
}