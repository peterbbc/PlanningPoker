import { Action } from "redux";
import { PokerTableActionType } from "./constants";
import { Player, PokerTable } from "@we-agile-you/types-planning-poker";

interface RequestCreatedPokerTableAction extends Action {
    type: PokerTableActionType.REQUEST_CREATE_POKER_TABLE
}

interface ReceiveCreatedPokerTableAction extends Action {
    type: PokerTableActionType.RECEIVE_CREATED_POKER_TABLE
    pokerTableId: string
}

interface RequestSubscribeToPokerTableAction extends Action {
    type: PokerTableActionType.REQUEST_SUBSCRIBE_TO_POKER_TABLE
}

interface ReceiveSubscribeToPokerTableAction extends Action {
    type: PokerTableActionType.RECEIVE_SUBSCRIBE_TO_POKER_TABLE
}

interface ReceivePokerTableDataChangeAction extends Action {
    type: PokerTableActionType.RECEIVE_POKER_TABLE_DATA_CHANGE
    data: PokerTable
}

interface ReceivePokerTablePlayersChangeAction extends Action {
    type: PokerTableActionType.RECEIVE_POKER_TABLE_PLAYERS_CHANGE
    players: Player[]
}

interface UnsubscribeToPokerTableAction extends Action {
    type: PokerTableActionType.UNSUBSCRIBE_TO_POKER_TABLE
}

export type PokerTableActions =
    RequestCreatedPokerTableAction |
    ReceiveCreatedPokerTableAction |
    RequestSubscribeToPokerTableAction |
    ReceiveSubscribeToPokerTableAction |
    ReceivePokerTableDataChangeAction |
    ReceivePokerTablePlayersChangeAction |
    UnsubscribeToPokerTableAction