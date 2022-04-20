import { HelpTooltip } from '@we-agile-you/react-base';
import React, { RefObject, useContext, useEffect } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface InviteTooltipProps {
  hasClickedInvite: boolean;
  refNode: RefObject<HTMLElement>;
}
export const InviteTooltip = ({
  hasClickedInvite,
  refNode,
}: InviteTooltipProps) => {
  const [isNewGameTooltipDone] = useOneTimeUserAction('startNewGameTooltip');
  const [isDone, setIsDone] = useOneTimeUserAction('inviteTooltip');
  const { isOwner } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const { pokerTable } = useCurrentTable();
  const playersLength = pokerTable?.players?.length;

  const isLoading =
    user === null ||
    isDone === null ||
    isOwner === null ||
    isNewGameTooltipDone === null;
  const isFirstGame = user?.totalGamesCreated === 1;

  const isOpen =
    !isLoading &&
    isDone === false &&
    isFirstGame &&
    isOwner &&
    isNewGameTooltipDone &&
    !hasClickedInvite &&
    !isSidebarOpen;

  useEffect(() => {
    if (isDone === false && hasClickedInvite) {
      setIsDone();
    }
  }, [hasClickedInvite, isDone, setIsDone]);

  useEffect(() => {
    if (
      isDone === false &&
      typeof playersLength === 'number' &&
      playersLength > 1
    ) {
      setIsDone();
    }
  }, [playersLength, isDone, setIsDone]);

  return (
    <HelpTooltip
      title="Invite players"
      refNode={refNode}
      position="bottom"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>All set! Share this game’s url with your teammates to start voting.</p>
    </HelpTooltip>
  );
};
