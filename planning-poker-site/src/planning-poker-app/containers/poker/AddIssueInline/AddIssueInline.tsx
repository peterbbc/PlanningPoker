import { Icon } from '../../../../packages/react-base';
import React, { useRef, useState } from 'react';
import { TextareaInlineEdit } from '../../../components/molecules/TextareaInlineEdit/TextareaInlineEdit';
import { useNotification } from '../../../spaces/notifications/useNotification';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import {
  cantEditIssuesNotification,
  useIssueActions,
} from '../../../spaces/poker-table/hooks/useIssueActions';

import styles from './AddIssueInline.module.scss';
import { AddIssueTooltip } from './AddIssueTooltip';

interface AddIssueInlineProps {
  onIssueAdded?: () => void;
}

export const AddIssueInline = ({ onIssueAdded }: AddIssueInlineProps) => {
  const [hasFocusedTextArea, setHasFocusedTextArea] = useState(false);
  const { addIssue, currentUserCanEditIssues } = useIssueActions();
  const { pokerTable } = useCurrentTable();
  const addIssueContainerRef = useRef<HTMLDivElement>(null);

  const handleBlur = (summary: string) => {
    if (!!summary) {
      addIssue({
        summary,
      }).then(() => onIssueAdded && onIssueAdded());
    }
  };

  const handleFocus = () => {
    setHasFocusedTextArea(true);
    if (addIssueContainerRef.current) {
      addIssueContainerRef.current.scrollIntoView();
    }
  };
  const { showNotification } = useNotification();

  const handleButtonClick = () => {
    if (!currentUserCanEditIssues) {
      showNotification(cantEditIssuesNotification);
    }
  };

  const label =
    pokerTable?.issues && pokerTable?.issues?.length > 0
      ? 'Add another issue'
      : 'Add an issue';

  return (
    <div className={styles['container']} ref={addIssueContainerRef}>
      <TextareaInlineEdit
        buttonLabel={
          <>
            <Icon icon="plus" />
            <span className={styles['button-label']}>{label}</span>
          </>
        }
        textareaPlaceholder="Enter a title for the issue"
        mode={
          currentUserCanEditIssues ? 'issue-card' : 'issue-card-no-permission'
        }
        value=""
        onBlur={handleBlur}
        onFocus={handleFocus}
        onButtonClick={handleButtonClick}
        isCreating
      />
      <AddIssueTooltip
        hasFocusedTextArea={hasFocusedTextArea}
        refNode={addIssueContainerRef}
      />
    </div>
  );
};
