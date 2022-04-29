import { Player, PokerTable } from '@we-agile-you/types-planning-poker';
import { useSelector } from 'react-redux';

import { AppState } from '../../rootReducer';
import useCurrentUser from '../../auth/hooks/useCurrentUser';

interface CurrentPokerTable {
  pokerTable: PokerTable;
  currentPlayer: Player | null;
  currentIssueIndex: number | null;
  isVoting: boolean | null;
  isOnCountdown: boolean;
  isOwner: boolean | null;
}

export const useCurrentTable = (): CurrentPokerTable => {
  const { uid } = useCurrentUser();
  const pokerTable = useSelector((state: AppState) => state.pokerTable);

  const currentPlayer =
    uid && pokerTable.players.find((player) => player.uid === uid);

  const isVoting = pokerTable.id
    ? pokerTable.players.some((player) => typeof player.vote === 'string')
    : null;

  const isOnCountdown = !!pokerTable.cardsUpCountdown;

  const currentIssueIndex =
    pokerTable.issues &&
    pokerTable.issues.findIndex((issue) => issue.isVotingNow);

  const issues = pokerTable.issues?.map((issue) => {
    if (!issue.url) return issue;

    return {
      ...issue,
      url:
        issue.url?.indexOf('http') === -1 ? `https://${issue.url}` : issue.url,
    };
  });

  return {
    pokerTable: issues ? { ...pokerTable, issues } : pokerTable,
    currentPlayer: currentPlayer || null,
    currentIssueIndex:
      typeof currentIssueIndex !== 'undefined' && currentIssueIndex !== -1
        ? currentIssueIndex
        : null,
    isVoting,
    isOnCountdown,
    isOwner: uid && pokerTable ? uid === pokerTable.ownerId : null,
  };
};
