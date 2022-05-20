import {
  ButtonActivable,
  ButtonDropdown,
  ButtonIcon,
  DropdownItem,
  Icon,
  PointsPicker
} from '../../../../../../packages/react-base';
import { Issue } from '../../../../../../packages/types-planning-poker';
import cx from 'classnames';
import React, { MouseEvent, useRef, useState } from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { FormatedTextContainer } from '../../../../../components/molecules/FormatedTextContainer/FormatedTextContainer';
import {
  hideCards,
  startTimerForGame,
} from '../../../../../spaces/poker-table/data/poker';
import { useCurrentTable } from '../../../../../spaces/poker-table/hooks/useCurrentTable';
import { useIssueActions } from '../../../../../spaces/poker-table/hooks/useIssueActions';

import styles from './IssueCard.module.scss';
import { VoteIssueTooltip } from './VoteIssueTooltip';

interface IssueCardProps {
  onOpen: (issue: Issue) => void;
  onDeleteIssue: (issue: Issue) => void;
  issue: Issue;
  i: number;
}

export const IssueCard = SortableElement(
  ({ onOpen, onDeleteIssue, issue, i }: IssueCardProps) => {
    const { setVotingIssue, unsetVotingIssue, editIssue, moveIssue } =
      useIssueActions();
    const [hasClickedVoteIssue, setHasClickedVoteIssue] = useState(false);
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const { pokerTable } = useCurrentTable();
    const voteIssueRef = useRef<HTMLDivElement>(null);

    const ctaLabel = !!issue.isVotingNow
      ? 'Voting now...'
      : !!issue.storyPoints || issue.storyPoints === 0
      ? 'Vote again'
      : 'Vote this issue';

    const handleIsVotingChange = (isVoting: boolean) => {
      setHasClickedVoteIssue(true);

      if (isVoting) {
        setVotingIssue(issue);

        if (pokerTable.id && pokerTable.cardsUp) {
          hideCards(pokerTable.id);
        }
        if (
          pokerTable.id &&
          pokerTable.timerDurationMinutes &&
          pokerTable.timerAutoRestart
        ) {
          startTimerForGame(pokerTable.id, pokerTable.timerDurationMinutes);
        }
      } else {
        unsetVotingIssue();
      }
    };

    const handleDelete = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setIsContextMenuOpen(false);
      onDeleteIssue(issue);
    };

    const handleMoveTop = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setIsContextMenuOpen(false);
      moveIssue(i, 0);
    };

    const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setIsContextMenuOpen(false);
      onOpen(issue);
    };

    const handleMoveBot = (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (!pokerTable.issues) return;

      setIsContextMenuOpen(false);
      moveIssue(i, pokerTable.issues.length - 1);
    };

    return (
      <li
        className={styles['element']}
        onClick={() => {
          onOpen(issue);
        }}
      >
        <div
          className={cx(
            styles['issue-card'],
            issue.isVotingNow && styles['issue-card--voting'],
            isContextMenuOpen && styles['issue-card--menu-open'],
          )}
        >
          <div className={styles['issue-card__header']}>
            <div className={styles['issue-card__key']}>
              <span>{issue.key}</span>
            </div>
            <div
              className={cx(styles['issue-card__context-menu'], 'is-clickable')}
            >
              <ButtonDropdown
                isOpen={isContextMenuOpen}
                size="s"
                isNoOpactity
                isIconButton
                align="bottom-left"
                color="secondary"
                onIsOpenChange={setIsContextMenuOpen}
                tooltipPosition="bottom-left"
                containerBackgroundColor={
                  issue.isVotingNow ? 'primary-white' : 'grey200'
                }
                onClick={(event) => {
                  event.stopPropagation();
                }}
                dropdown={
                  <div>
                    <DropdownItem label="Open" onClick={handleOpen} />
                    <DropdownItem label="Move to top" onClick={handleMoveTop} />
                    <DropdownItem
                      label="Move to bottom"
                      onClick={handleMoveBot}
                    />
                    <DropdownItem label="Delete" onClick={handleDelete} />
                  </div>
                }
              >
                <Icon icon="ellipsis-h" />
              </ButtonDropdown>
            </div>
          </div>
          <div className={styles['issue-card__summary']}>
            <FormatedTextContainer
              text={issue.summary || ''}
              mode="issue-card"
            />
          </div>
          <div className={styles['issue-card__footer']}>
            <div ref={voteIssueRef}>
              <ButtonActivable
                className={'is-clickable'}
                isActive={!!issue.isVotingNow}
                size="small"
                overBackgroundColor={
                  !!issue.isVotingNow ? 'primary-whiter' : 'grey100'
                }
                onIsActiveChange={handleIsVotingChange}
                onClick={(event) => event.stopPropagation()}
              >
                {ctaLabel}
              </ButtonActivable>
              {i === 1 && (
                <VoteIssueTooltip
                  refNode={voteIssueRef}
                  hasClickedVoteIssue={hasClickedVoteIssue}
                />
              )}
            </div>
            <div className={styles['issue-card__footer-right']}>
              {!!issue.url && (
                <div className={styles['issue-card__link']}>
                  <a
                    onClick={(event) => event.stopPropagation()}
                    href={issue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ButtonIcon
                      buttonColor="primary"
                      icon={<Icon icon="open" />}
                      containerBackgroundColor={
                        issue.isVotingNow ? 'primary-white' : 'grey200'
                      }
                      tooltip={
                        issue.provider === 'jira' ? 'View in Jira' : 'Open'
                      }
                      tooltipPosition="top"
                    />
                  </a>
                </div>
              )}
              <div>
                <PointsPicker
                  value={
                    issue.storyPoints || issue.storyPoints === 0
                      ? issue.storyPoints
                      : null
                  }
                  onChange={(card: string | null) => {
                    editIssue(issue.key, { storyPoints: card });
                  }}
                  deck={pokerTable.deck}
                  overBackgroundColor={
                    issue.isVotingNow ? 'primary-white' : 'grey100'
                  }
                  align="left"
                  isInIssueCard
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  },
);
