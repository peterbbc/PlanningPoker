import { ButtonIcon, ConfirmModal, Icon, Span } from '@we-agile-you/react-base';
import { Issue } from '@we-agile-you/types-planning-poker';
import cx from 'classnames';
import React, { useContext, useRef, useState } from 'react';
import { SortEnd } from 'react-sortable-hoc';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { useIssueActions } from '../../../spaces/poker-table/hooks/useIssueActions';

import { AddIssueInline } from '../AddIssueInline/AddIssueInline';
import { IssueModal } from '../IssueModal/IssueModal';
import { SidebarStateContext } from '../SidebarLayoutWrapper/SidebarLayoutWrapper';
import { ExtraActionsDropdown } from './ExtraActionsDropdown/ExtraActionsDropdown';
import { ImportDropdown } from './ImportDropdown/ImportDropdown';
import stylesCard from './IssueListSidebar/IssueCard/IssueCard.module.scss';
import { IssueListSidebar } from './IssueListSidebar/IssueListSidebar';
import { SaveInJiraButton } from './SaveInJiraButton/SaveInJiraButton';
import styles from './Sidebar.module.scss';
import { SortIssuesTooltip } from './SortIssuesTooltip';

export const Sidebar = () => {
  const setIsSidebarOpen = useContext(SidebarStateContext)[1];
  const [isIssueModalOpen, setIsIssueModalOpen] = useState<Issue | false>(
    false,
  );
  const [hasSortedElements, setHasSortedElements] = useState(false);
  const { pokerTable } = useCurrentTable();
  const voteIssueRef = useRef<HTMLDivElement>(null);
  const issuesContainerEnd = useRef<HTMLDivElement>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<Issue | false>(
    false,
  );
  const { deleteIssue, moveIssue } = useIssueActions();

  const handleSortStart = () => {
    document.body.style.cursor = 'grabbing';
  };
  const handleSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    document.body.style.cursor = '';
    moveIssue(oldIndex, newIndex);

    if (!hasSortedElements) {
      setHasSortedElements(true);
    }
  };

  const handleIssueAdded = () => {
    if (issuesContainerEnd.current) {
      issuesContainerEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalPoints = pokerTable.issues?.reduce<number | null>(
    (total, issue) => {
      const points =
        (typeof issue.storyPoints === 'string' ||
          typeof issue.storyPoints === 'number') &&
        Number(issue.storyPoints);

      if (!Number.isNaN(points)) {
        return total !== null ? total + points : points;
      }
      return total;
    },
    null,
  );

  return (
    <>
      <div className={cx(styles['sidebar'])}>
        <div className={styles['header']}>
          <div className={styles['header__left']}>
            <div className={styles['title']}>
              <div>
                <Span spanStyle="bold"> Issues</Span>
              </div>
              {!!pokerTable.issues?.length && (
                <div>
                  <Span size="micro" color="grey500" spanStyle="bold">{`${
                    pokerTable.issues?.length || '-'
                  } issue${pokerTable.issues?.length !== 1 ? 's' : ''}`}</Span>
                  {typeof totalPoints === 'number' && (
                    <>
                      <span> </span>
                      <Span size="micro" color="grey500" spanStyle="bold">
                        •
                      </Span>
                      <span> </span>
                      <Span
                        size="micro"
                        color="grey500"
                        spanStyle="bold"
                      >{`${totalPoints} point${
                        totalPoints !== 1 ? 's' : ''
                      }`}</Span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={styles['header__right']}>
            <span className={styles['jira-actions']}>
              <SaveInJiraButton />
              <ImportDropdown />
            </span>
            {!!pokerTable.issues?.length && <ExtraActionsDropdown />}

            <div className={styles['header__divider']} />
            <ButtonIcon
              className={styles['close']}
              onClick={() => setIsSidebarOpen(false)}
              icon={<Icon icon="close" />}
              tooltip="Hide issues"
            />
          </div>
        </div>
        <div className={styles['content-wrapper']}>
          <div className={styles['content']} ref={voteIssueRef}>
            <div className={styles['issues-container']}>
              {pokerTable && pokerTable.issues && pokerTable.issues.length > 0 && (
                <IssueListSidebar
                  issues={pokerTable.issues}
                  helperClass={stylesCard['sortable-helper']}
                  onSortStart={handleSortStart}
                  onSortEnd={handleSortEnd}
                  distance={5}
                  shouldCancelStart={() => window.innerWidth < 920}
                  onOpenIssue={(issue) => {
                    setIsIssueModalOpen(issue);
                  }}
                  onDeleteIssue={(issue) => {
                    setIsDeleteConfirmOpen(issue);
                  }}
                />
              )}
              <div ref={issuesContainerEnd} />
            </div>
            <div className={styles['add-issue']}>
              <AddIssueInline onIssueAdded={handleIssueAdded} />
            </div>

            <SortIssuesTooltip
              hasSortedElements={hasSortedElements}
              refNode={voteIssueRef}
            />
          </div>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isDanger
          title="Are you sure you want to delete this issue?"
          content="This operation is irreversible."
          confirmLabel="Delete issue"
          cancelLabel="Cancel"
          onConfirm={() => {
            deleteIssue(isDeleteConfirmOpen).catch(() => {});
            setIsDeleteConfirmOpen(false);
          }}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
      {isIssueModalOpen && (
        <IssueModal
          issue={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
        />
      )}
    </>
  );
};
