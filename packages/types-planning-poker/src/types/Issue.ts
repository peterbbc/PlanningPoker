export interface Issue {
    key: string
    id?: string
    addedByUid?: string
    provider: string
    url?: string
    summary: string
    description?: string
    isVotingNow?: boolean
    storyPoints?: string | number
}