import { Timestamp } from "firebase/firestore";
import { WhoCanShowCardsType } from "./WhoCanShowCardsType";

export interface VotingServer {
    timestamp: Timestamp
    whoCanShowCards: WhoCanShowCardsType
}