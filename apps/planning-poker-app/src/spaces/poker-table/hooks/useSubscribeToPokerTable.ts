import { subscribeToTable } from './../data/pokerSubscription';
import { Player, PokerTable } from '@we-agile-you/types-planning-poker';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  RECEIVE_POKER_TABLE_DATA_CHANGE,
  RECEIVE_POKER_TABLE_PLAYERS_CHANGE,
  REQUEST_SUBSCRIBE_TO_POKER_TABLE,
  UNSUBSCRIBE_TO_POKER_TABLE,
} from '../constants';

const useSubscribeToPokerTable = (
  tableId: string,
): { tableExists: boolean | null } => {
  const dispatch = useDispatch();
  const [tableExists, setTableExists] = useState<null | boolean>(null);

  useEffect(() => {
    dispatch({
      type: REQUEST_SUBSCRIBE_TO_POKER_TABLE,
    });

    const handleTableChange = (table: Partial<PokerTable>) => {
      dispatch({
        type: RECEIVE_POKER_TABLE_DATA_CHANGE,
        data: table,
      });
      setTableExists(true);
    };

    const handleTablePlayersChange = (players: Player[]) => {
      dispatch({
        type: RECEIVE_POKER_TABLE_PLAYERS_CHANGE,
        players,
      });
    };

    const handleTableDontExist = () => {
      setTableExists(false);
    };

    const unsubscribeToPokerTable = subscribeToTable(
      tableId,
      handleTableChange,
      handleTablePlayersChange,
      handleTableDontExist,
    );

    return function cleanup() {
      unsubscribeToPokerTable();

      dispatch({
        type: UNSUBSCRIBE_TO_POKER_TABLE,
      });
    };
  }, [tableId, dispatch]);

  return { tableExists };
};

export default useSubscribeToPokerTable;
