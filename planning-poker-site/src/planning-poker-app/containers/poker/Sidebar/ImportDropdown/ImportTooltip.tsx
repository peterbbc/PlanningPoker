import { HelpTooltip } from '../../../../../packages/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import useCurrentUser from '../../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface ImportTooltipProps {
  hasOpenedImportDropdown: boolean;
  refNode: RefObject<HTMLElement>;
}
export const ImportTooltip = ({
  hasOpenedImportDropdown,
  refNode,
}: ImportTooltipProps) => {
  const isDoneVoteIssue = useOneTimeUserAction('voteIssueTooltip')[0];
  const [isDone, setIsDone] = useOneTimeUserAction('importTooltip');
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
    !hasOpenedImportDropdown &&
    isDoneVoteIssue &&
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
    if (isDone === false && hasOpenedImportDropdown) {
      setIsDone();
    }
  }, [hasOpenedImportDropdown, isDone, setIsDone]);

  return (
    <HelpTooltip
      refNode={refNode}
      title="Did you know...?"
      position="bottom"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>
        You can import issues from Jira or from any other app by pasting the
        urls of the issues.
      </p>
    </HelpTooltip>
  );
};
