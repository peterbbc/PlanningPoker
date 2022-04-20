import { HelpTooltip } from '@we-agile-you/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import useCurrentUser from '../../../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../../../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface VoteIssueTooltipProps {
  hasClickedVoteIssue: boolean;
  refNode: RefObject<HTMLElement>;
}
export const VoteIssueTooltip = ({
  hasClickedVoteIssue,
  refNode,
}: VoteIssueTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('voteIssueTooltip');
  const { isOwner, pokerTable } = useCurrentTable();
  const { user } = useCurrentUser();
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const [hasSidebarOpened, setHasSidebarOpened] = useState(false);

  const tableHasSeveralIssues =
    !!pokerTable?.issues && pokerTable.issues.length > 1;

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
    !hasClickedVoteIssue &&
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
    if (isDone === false && hasClickedVoteIssue && isOwner) {
      setIsDone();
    }
  }, [hasClickedVoteIssue, isDone, isOwner, setIsDone]);

  return (
    <HelpTooltip
      refNode={refNode}
      title="Select the issue being voted"
      position="left"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>
        Let your teammates know which issue is being voted by clicking “vote
        this issue”.
      </p>
    </HelpTooltip>
  );
};
