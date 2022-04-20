import { PokerTable } from '@we-agile-you/types-planning-poker';
import {
  RECEIVE_CREATED_POKER_TABLE,
  RECEIVE_POKER_TABLE_DATA_CHANGE,
  RECEIVE_POKER_TABLE_PLAYERS_CHANGE,
  REQUEST_CREATE_POKER_TABLE,
  REQUEST_SUBSCRIBE_TO_POKER_TABLE,
  UNSUBSCRIBE_TO_POKER_TABLE,
} from '../constants';

import { PokerTableActionTypes } from '../types';

export const initialPokerTableState: PokerTable = {
  isCreating: false,
  isFetching: false,
  id: null,
  createdAt: null,
  ownerId: null,
  players: [],
  playersAll: [],
  cardsUp: null,
  isPremium: null,
  isGameOver: null,
  isSomePlayersReachedFreeLimit: null,
  deck: [],
};

export const pokerTableReducer = function pokerTableReducer(
  state = initialPokerTableState,
  action: PokerTableActionTypes,
): PokerTable {
  switch (action.type) {
    case REQUEST_CREATE_POKER_TABLE:
      return {
        ...state,
        isCreating: true,
      };

    case RECEIVE_CREATED_POKER_TABLE:
      return {
        ...state,
        isCreating: false,
        id: action.pokerTableId,
      };

    case REQUEST_SUBSCRIBE_TO_POKER_TABLE:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_POKER_TABLE_DATA_CHANGE:
      return {
        ...state,
        ...action.data,
        isFetching: false,
        players: state.players,
        playersAll: state.playersAll,
      };

    case RECEIVE_POKER_TABLE_PLAYERS_CHANGE:
      const players = action.players;

      return {
        ...state,
        players: players.filter((player) => {
          if (player.state === 'online') return true;

          if (
            typeof player.vote === 'string' ||
            typeof player.vote === 'number'
          ) {
            // don't hide disconected players that have voted
            const nowSeconds = Date.now() / 1000;
            const lastChangedSeconds = player?.last_changed?.seconds;

            if (lastChangedSeconds && lastChangedSeconds < nowSeconds - 3600) {
              return false;
            }

            return true;
          }

          return false;
        }),
        playersAll: players,
      };

    case UNSUBSCRIBE_TO_POKER_TABLE:
      return {
        ...initialPokerTableState,
      };

    default:
      return state;
  }
};
