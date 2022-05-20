import { HelpTooltip, usePrevious } from '../../../../packages/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface StartNewGameTooltipProps {
  refNode: RefObject<HTMLElement>;
}
export const StartNewGameTooltip = ({ refNode }: StartNewGameTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('startNewGameTooltip');
  const [hasVoted, setHasVoted] = useState(false);
  const { pokerTable, isOwner } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);

  const isLoading = pokerTable.id === null || user === null || isDone === null;

  const showCards = pokerTable.cardsUp;
  const previousShowCards = usePrevious(showCards);
  const isFirstGame = user?.totalGamesCreated === 1;

  const isOpen =
    !isLoading &&
    isDone === false &&
    isFirstGame &&
    isOwner &&
    showCards &&
    !isSidebarOpen;

  useEffect(() => {
    if (isDone === false && isOwner && hasVoted) {
      setIsDone();
    }
  }, [hasVoted, isDone, isOwner, setIsDone, showCards]);

  useEffect(() => {
    if (!showCards && previousShowCards) {
      setHasVoted(true);
    }
  }, [showCards, previousShowCards]);

  return (
    <HelpTooltip
      title="Start new game"
      refNode={refNode}
      position="right"
      specialStyle="table-right"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>Click on “start new voting” to reset cards and start a new voting.</p>
    </HelpTooltip>
  );
};
