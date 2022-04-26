import { PokerTableSummary } from "./PokerTableSummary";

export interface PokerTableSummaryHistory extends PokerTableSummary {
    lastJoinedAtMilis: number
    createdAtMilis: number
}