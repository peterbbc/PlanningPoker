import { Issue } from '../../../../../packages/types-planning-poker';
import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';

import { IssueCard } from './IssueCard/IssueCard';
import styles from './IssueListSidebar.module.scss';

interface IssueListSidebarProps {
  issues: Issue[];
  onOpenIssue: (issue: Issue) => void;
  onDeleteIssue: (issue: Issue) => void;
}

export const IssueListSidebar = SortableContainer(
  ({ issues, onOpenIssue, onDeleteIssue }: IssueListSidebarProps) => {
    return (
      <ul className={styles.list}>
        {issues.map((issue, i) => (
          <IssueCard
            key={issue.id || i}
            index={i}
            i={i}
            issue={issue}
            onDeleteIssue={onDeleteIssue}
            onOpen={() => {
              onOpenIssue(issue);
            }}
          />
        ))}
      </ul>
    );
  },
);
