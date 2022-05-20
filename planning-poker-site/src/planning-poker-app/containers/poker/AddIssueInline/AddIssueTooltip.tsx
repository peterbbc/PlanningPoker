import { HelpTooltip } from '../../../../packages/react-base';
import React, { RefObject, useContext, useEffect, useState } from 'react';
import { useOneTimeUserAction } from '../../../spaces/auth/hooks/useOneTimeUserAction';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';

import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';

interface AddIssueTooltipProps {
  hasFocusedTextArea: boolean;
  refNode: RefObject<HTMLElement>;
}

export const AddIssueTooltip = ({
  refNode,
  hasFocusedTextArea,
}: AddIssueTooltipProps) => {
  const [isDone, setIsDone] = useOneTimeUserAction('addIssueTooltip');
  const { pokerTable, isOwner } = useCurrentTable();
  const [isSidebarOpen] = useContext(SidebarStateContext);
  const [hasSidebarOpened, setHasSidebarOpened] = useState(false);

  const isLoading =
    pokerTable.id === null || isOwner === null || isDone === null;

  const isOpen =
    !isLoading &&
    !hasFocusedTextArea &&
    isDone === false &&
    isOwner &&
    hasSidebarOpened;

  useEffect(() => {
    if (isDone === false && hasFocusedTextArea && isOwner) {
      setIsDone();
    }
  }, [isDone, isOwner, hasFocusedTextArea, setIsDone]);

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

  if (!hasSidebarOpened) return null;

  return (
    <HelpTooltip
      title="Add issues to the game"
      refNode={refNode}
      position="bottom"
      specialStyle="add-issue"
      isOpen={!!isOpen}
      onClose={setIsDone}
    >
      <p>Click “Add an issue” to include them into the game</p>
    </HelpTooltip>
  );
};
