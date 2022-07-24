import {
  Checkbox,
  FormCheckbox,
  Paragraph,
  VerticalSpacing,
} from '../../../../packages/react-base';
import { Issue } from '../../../../packages/types-planning-poker';
import React, { useEffect, useState } from 'react';

import styles from './JiraIssueList.module.scss';

interface JiraIssueListProps {
  issues: Issue[];
  selectedIssues: Issue[];
  onSelectedIssuesChange: (selectedIssues: Issue[]) => void;
}

export const JiraIssueList = ({
  issues,
  selectedIssues,
  onSelectedIssuesChange,
}: JiraIssueListProps) => {
  const isSelectedAllIssues: boolean =
    !!issues &&
    issues.length === selectedIssues.length &&
    selectedIssues.reduce<boolean>((areTheSame, issue) => {
      return areTheSame && !!issues.find((_issue) => _issue.id === issue.id);
    }, true);

  const [globalCheckboxValue, setGlobalCheckboxValue] = useState(
    isSelectedAllIssues,
  );
  useEffect(() => {
    setGlobalCheckboxValue(isSelectedAllIssues);
  }, [isSelectedAllIssues]);

  const handleIssueCheckboxChanged = (state: boolean, issue: Issue) => {
    if (state) {
      onSelectedIssuesChange([...selectedIssues, issue]);
    } else {
      onSelectedIssuesChange(
        selectedIssues.filter((_issue) => _issue.id !== issue.id),
      );
    }
  };

  const handleGlobalCheckboxChanged = (state: boolean) => {
    if (!issues) return;

    if (state) {
      onSelectedIssuesChange(issues);
    } else {
      onSelectedIssuesChange([]);
    }

    setGlobalCheckboxValue(state);
  };

  return (
    <>
      <div className={styles.selectAllContainer}>
        <div>
          {!!issues.length && (
            <FormCheckbox
              id="select-all"
              isChecked={globalCheckboxValue}
              onChange={(val) => handleGlobalCheckboxChanged(val)}
              boxSize="big"
              label="Select all issues"
            />
          )}
        </div>
      </div>
      {!!issues.length ? (
        <>
          <ul className={styles.issueList}>
            {issues.map((issue, i) => {
              const isChecked = !!selectedIssues.find(
                (_issue) => _issue.id === issue.id,
              );
              return (
                <li
                  key={i}
                  className={styles.issue}
                  onClick={() => handleIssueCheckboxChanged(!isChecked, issue)}
                >
                  <div className={styles.issue__checkbox}>
                    <Checkbox
                      checked={isChecked}
                      onChange={(_val, state: boolean) =>
                        handleIssueCheckboxChanged(state, issue)
                      }
                      boxSize="big"
                    />
                  </div>
                  <div className={styles.issue__left}>
                    <div className={styles.issue__key}>
                      {issue.url ? (
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {issue.key}
                        </a>
                      ) : (
                        <span>{issue.key}</span>
                      )}
                    </div>
                    <div className={styles.issue__summary}>
                      <p>{issue.summary}</p>
                    </div>
                  </div>
                  <div className={styles.issue__points}>
                    <span>
                      {typeof issue.storyPoints === 'string' ||
                      typeof issue.storyPoints === 'number'
                        ? issue.storyPoints
                        : '-'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <VerticalSpacing spacing="spacing-xl" />
        </>
      ) : (
        <div>
          <VerticalSpacing spacing="spacing-xxl-4" />
          <Paragraph color="grey500" align="center">
            We didn't find any issues matching your filters
          </Paragraph>
        </div>
      )}
    </>
  );
};
