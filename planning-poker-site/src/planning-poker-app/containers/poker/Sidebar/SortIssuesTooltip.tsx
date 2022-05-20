import { HelpTooltip } from '../../../../packages/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface SortIssuesTooltipProps {
  hasSortedElements: boolean;
  refNode: RefObject<HTMLElement>;
}
export const SortIssuesTooltip = ({
  hasSortedElements,
  refNode,
}: SortIssuesTooltipProps) => {
  const isDoneVoteIssue = useOneTimeUserAction('voteIssueTooltip')[0];
  const [isDone, setIsDone] = useOneTimeUserAction('sortIssuesTooltip');
  const { isOwner, pokerTable } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const [hasSidebarOpened, setHasSidebarOpened] = useState(false);

  const tableHasSeveralIssues =
    !!pokerTable?.issues && pokerTable.issues.length > 4;

  const isLoading =
    user === null ||
    isDone === null ||
    isOwner === null ||
    pokerTable.id === null;

  const isOpen =
    !isLoading &&
    isDone === false &&
    tableHasSeveralIssues &&
    isOwner &&
    !hasSortedElements &&
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
    if (isDone === false && hasSortedElements) {
      setIsDone();
    }
  }, [hasSortedElements, isDone, isOwner, setIsDone]);

  return (
    <HelpTooltip
      refNode={refNode}
      title="Did you know...?"
      position="left"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
      specialStyle="sort-issues"
    >
      <p>You can sort the issues by dragging them.</p>
    </HelpTooltip>
  );
};
