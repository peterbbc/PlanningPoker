import { FREEMIUM_ISSUES_VOTED_LIMIT } from '@we-agile-you/constants-planning-poker';
import { useMemo } from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from './../../spaces/poker-table/hooks/useCurrentTable';
export const useRobotLimitMessage = () => {
  const { pokerTable } = useCurrentTable();
  const { isPremium, isFacilitator } = useCurrentUser();

  const votingCountdownAlertMessage = (() => {
    if (
      typeof pokerTable.votingCountdown !== 'number' ||
      pokerTable.votingCountdown === 0
    )
      return null;

    if (pokerTable.votingCountdown === 1) {
      return `You only have 1 voting left 😱 !`;
    }

    return `You have ${pokerTable.votingCountdown} votings left.`;
  })();
  const votingCountdownEndedAlertMessage =
    pokerTable.votingCountdown === 0
      ? `You have reached the limit of votings 😢`
      : null;

  const issuesVotedAlertMessage =
    pokerTable.issuesVotedCount === FREEMIUM_ISSUES_VOTED_LIMIT - 1
      ? `You only have 1 issue left to vote 😱 !`
      : null;
  const issuesVotedEndedAlertMessage =
    pokerTable.issuesVotedCount &&
    pokerTable.issuesVotedCount >= FREEMIUM_ISSUES_VOTED_LIMIT
      ? `You have reached the limit of issues voted 😢`
      : null;

  const playersReachedLimitMessage = pokerTable.isSomePlayersReachedFreeLimit
    ? `We have known each other for a while now, why not going premium?`
    : null;

  const messages: string[] = useMemo(
    () =>
      [
        votingCountdownAlertMessage,
        votingCountdownEndedAlertMessage,
        issuesVotedAlertMessage,
        issuesVotedEndedAlertMessage,
        playersReachedLimitMessage,
      ].filter((message) => !!message) as string[],
    [
      votingCountdownAlertMessage,
      votingCountdownEndedAlertMessage,
      issuesVotedAlertMessage,
      issuesVotedEndedAlertMessage,
      playersReachedLimitMessage,
    ],
  );

  const isLoading = !pokerTable.id || isPremium === null;

  return {
    showLimitMessages:
      !isLoading &&
      !pokerTable?.isPremium &&
      !isPremium &&
      !isFacilitator &&
      !!messages.length,
    messages,
  };
};
