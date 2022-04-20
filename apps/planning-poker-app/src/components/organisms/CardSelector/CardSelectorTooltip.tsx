import { HelpTooltip } from '@we-agile-you/react-base';
import React, { RefObject, useContext, useEffect } from 'react';

import { SidebarStateContext } from '../../../containers/poker/SidebarLayoutWrapper/SidebarLayoutWrapper';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

interface CardSelectorTooltipProps {
  refNode: RefObject<HTMLElement>;
}

export const CardSelectorTooltip = ({ refNode }: CardSelectorTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('cardSelectorTooltip');
  const { isVoting, isOwner } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);

  const isLoading = isVoting === null || user === null || isDone === null;

  const isFirstGame = !user?.totalGamesCreated || user?.totalGamesCreated === 1;

  const isOpen =
    !isLoading &&
    isDone === false &&
    isFirstGame &&
    isOwner &&
    !isVoting &&
    !isSidebarOpen;

  useEffect(() => {
    if (isDone === false && isVoting && isOwner) {
      setIsDone();
    }
  }, [isDone, isOwner, isVoting, setIsDone]);

  return (
    <HelpTooltip
      title="Welcome! Please pick a card"
      refNode={refNode}
      position="left"
      specialStyle="card-selector"
      isOpen={!!isOpen}
      onClose={setIsDone}
    >
      <p>Your card won’t be visible to your teammates.</p>
    </HelpTooltip>
  );
};
