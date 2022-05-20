import { HelpTooltip } from '../../../../../packages/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import useCurrentUser from '../../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface SavedInJiraTooltipProps {
  hasClickedSavedInJira: boolean;
  canSaveInJira: boolean;
  refNode: RefObject<HTMLElement>;
}
export const SavedInJiraTooltip = ({
  hasClickedSavedInJira,
  canSaveInJira,
  refNode,
}: SavedInJiraTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('saveInJiraTooltip');
  const { isOwner, pokerTable } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const [hasSidebarOpened, setHasSidebarOpened] = useState(false);

  const isLoading =
    user === null ||
    isDone === null ||
    isOwner === null ||
    pokerTable.id === null;

  const isOpen =
    !isLoading &&
    isDone === false &&
    isOwner &&
    canSaveInJira &&
    !hasClickedSavedInJira &&
    hasSidebarOpened;

  useEffect(() => {
    if (!isSidebarOpen) setHasSidebarOpened(false);
    if (isSidebarOpen && !hasSidebarOpened) {
      window.setTimeout(() => {
        if (setHasSidebarOpened) {
          setHasSidebarOpened(true);
        }
      }, 400);
    }
  }, [hasSidebarOpened, isSidebarOpen]);

  useEffect(() => {
    if (isDone === false && hasClickedSavedInJira) {
      setIsDone();
    }
  }, [hasClickedSavedInJira, isDone, setIsDone]);

  return (
    <HelpTooltip
      refNode={refNode}
      title="Did you know...?"
      position="bottom"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>
        Once voting is finished, you can save the results back to Jira using
        this button.
      </p>
    </HelpTooltip>
  );
};
