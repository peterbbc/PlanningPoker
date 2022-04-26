import { createPokerGame } from '../data/poker';
import { PokerTable, User } from '@we-agile-you/types-planning-poker';
import { Dispatch } from 'redux';
import {
  RECEIVE_CREATED_POKER_TABLE,
  REQUEST_CREATE_POKER_TABLE,
} from '../constants';

export const createPokerTable = async (
  table: Partial<PokerTable>,
  user: User,
  dispatch: Dispatch,
): Promise<string> => {
  dispatch({
    type: REQUEST_CREATE_POKER_TABLE,
  });

  const gameId = await createPokerGame(table, user);

  dispatch({
    type: RECEIVE_CREATED_POKER_TABLE,
    pokerTableId: gameId,
  });

  return gameId;
};
