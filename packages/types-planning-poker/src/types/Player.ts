export interface Player {
    uid: string
    displayName?: string
    profilePictureUrl?: string
    state?: "online"
    vote?: "string" | "number"
    tableId: string
    tableName?: string
    isSpectator?: boolean
}