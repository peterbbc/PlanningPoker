import { HelpTooltip } from '../../../../packages/react-base';
import React, { RefObject, useEffect } from 'react';
import useCurrentUser from '../../../spaces/auth/hooks/useCurrentUser';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

interface InviteTooltipProps {
  hasClickedIssues: boolean;
  refNode: RefObject<HTMLElement>;
}
export const IssuesTooltip = ({
  hasClickedIssues,
  refNode,
}: InviteTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('issuesTooltip');
  const { isOwner } = useCurrentTable();
  const { user } = useCurrentUser();

  const hasVotedSeveralTimes = user?.votingCount && user?.votingCount > 3;

  const isLoading = user === null || isDone === null || isOwner === null;

  const isOpen =
    !isLoading &&
    isDone === false &&
    hasVotedSeveralTimes &&
    isOwner &&
    !hasClickedIssues;

  useEffect(() => {
    if (isDone === false && hasClickedIssues && isOwner) {
      setIsDone();
    }
  }, [hasClickedIssues, isDone, isOwner, setIsDone]);

  return (
    <HelpTooltip
      refNode={refNode}
      title="Did you know…?"
      position="bottom"
      specialStyle="issues"
      isOpen={!!isOpen}
      onClose={() => setIsDone()}
    >
      <p>You can add the issues you want to vote from here.</p>
    </HelpTooltip>
  );
};
