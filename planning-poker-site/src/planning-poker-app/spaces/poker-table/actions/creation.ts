import { createPokerGame } from '../data/poker';
import { PokerTable, User } from '../../../../packages/types-planning-poker';
import { Dispatch } from 'redux';
import { PokerTableActionType } from '../constants';

export const createPokerTable = async (
  table: Partial<PokerTable>,
  user: User,
  dispatch: Dispatch,
): Promise<string> => {
  dispatch({
    type: PokerTableActionType.REQUEST_CREATE_POKER_TABLE,
  });

  const gameId = await createPokerGame(table, user);

  dispatch({
    type: PokerTableActionType.RECEIVE_CREATED_POKER_TABLE,
    pokerTableId: gameId,
  });

  return gameId;
};
