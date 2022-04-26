import { updateCurrentUserGameHistory } from '../data/user';
import { useEffect, useMemo, useState } from 'react';

import { useCurrentTable } from '../../poker-table/hooks/useCurrentTable';
import useCurrentUser from './useCurrentUser';
import { PokerTableSummaryHistory } from '@we-agile-you/types-planning-poker';

export const useUpdateCurrentUserGameHistory = () => {
  const { pokerTable } = useCurrentTable();
  const { user } = useCurrentUser();
  const [previousSummary, setPreviousSummary] =
    useState<PokerTableSummaryHistory | null>(null);

  const pokerTableSummary: PokerTableSummaryHistory | null = useMemo(() => {
    return pokerTable.id && pokerTable.createdAt
      ? {
          id: pokerTable.id,
          name: pokerTable.name || '',
          lastJoinedAtMilis: Date.now(),
          createdAtMilis: pokerTable.createdAt.toMillis(),
        }
      : null;
  }, [pokerTable.id, pokerTable.name, pokerTable.createdAt]);

  useEffect(() => {
    if (pokerTableSummary === null || user === null) return;

    const hasTableChanged =
      previousSummary === null ||
      previousSummary.id !== pokerTableSummary.id ||
      previousSummary.name !== pokerTableSummary.name ||
      previousSummary.createdAtMilis !== pokerTableSummary.createdAtMilis;

    if (hasTableChanged) {
      updateCurrentUserGameHistory(user, pokerTableSummary);
      setPreviousSummary(pokerTableSummary);
    }
  }, [pokerTableSummary, user, previousSummary]);
};
