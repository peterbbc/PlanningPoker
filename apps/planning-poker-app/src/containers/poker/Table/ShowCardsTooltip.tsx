import { HelpTooltip } from '@we-agile-you/react-base';
import React, { RefObject, useContext, useEffect } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface ShowCardsTooltipProps {
  refNode: RefObject<HTMLElement>;
}
export const ShowCardsTooltip = ({ refNode }: ShowCardsTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('showCardsTooltip');
  const { pokerTable, isVoting, isOwner } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);

  const isLoading = isVoting === null || user === null || isDone === null;

  const isFirstGame = user?.totalGamesCreated === 1;

  const showCards = pokerTable.cardsUp;

  const isOpen =
    !isLoading &&
    isDone === false &&
    isFirstGame &&
    isOwner &&
    isVoting &&
    !showCards &&
    !isSidebarOpen;

  useEffect(() => {
    if (isDone === false && isOwner && showCards) {
      setIsDone();
    }
  }, [isDone, isOwner, setIsDone, showCards]);

  return (
    <HelpTooltip
      title="Show cards"
      refNode={refNode}
      position="left"
      specialStyle="table-left"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>
        Once everyone has picked their cards click on “reveal cards” to see the
        results of the voting.
      </p>
    </HelpTooltip>
  );
};
