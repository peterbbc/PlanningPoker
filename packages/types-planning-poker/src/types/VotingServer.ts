import { Timestamp } from "firebase/firestore";
import { WhoCanShowCardsType } from "./WhoCanEditIssuesType";

export interface VotingServer {
    timestamp: Timestamp
    whoCanShowCards: WhoCanShowCardsType
}