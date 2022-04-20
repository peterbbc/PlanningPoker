import {
  ButtonActivable,
  ButtonIcon,
  ConfirmModal,
  Icon,
  Modal,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import { Issue } from '@we-agile-you/types-planning-poker';

import { useIssueActions } from '../../../spaces/poker-table/hooks/useIssueActions';
import { useCurrentTable } from '../../../spaces/poker-table/hooks/useCurrentTable';
import { TextareaInlineEdit } from '../../../components/molecules/TextareaInlineEdit/TextareaInlineEdit';

import styles from './IssueModal.module.scss';
import { JiraDescription } from '../../../components/molecules/JiraDescription/JiraDescription';
import { hideCards } from '../../../spaces/poker-table/data/poker';
import { PointsPicker } from '@we-agile-you/react-base/molecules/PointsPicker/PointsPicker';
import { useNotification } from '../../../spaces/notifications/useNotification';

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
}

export const IssueModal = ({ issue, onClose }: IssueModalProps) => {
  const { editIssue, deleteIssue, setVotingIssue, unsetVotingIssue } =
    useIssueActions();
  const { pokerTable } = useCurrentTable();
  const [currentIssueKey, setCurrentIssueKey] = useState<string>();
  const [isFocusLink, setIsFocusLink] = useState(false);
  const [isFocusDescription, setIsFocusDescription] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { showNotification } = useNotification();

  const issueKey = issue.key;

  useEffect(() => {
    setCurrentIssueKey(issueKey);
  }, [issueKey]);

  const currentIssue =
    pokerTable.issues &&
    pokerTable.issues.find((issue) => issue.key === currentIssueKey);

  const handleCloseModal = () => {
    onClose();
  };

  const handleSummaryBlur = (value: string) => {
    if (!currentIssueKey) return;

    if (value) {
      editIssue(currentIssueKey, {
        summary: value,
      });
    }
  };

  const handleLinkBlur = (url: string) => {
    if (!currentIssueKey) return;

    setIsFocusLink(false);

    editIssue(currentIssueKey, {
      url,
    });
  };

  const handleDescriptionBlur = (value: string) => {
    if (!currentIssueKey) return;

    setIsFocusDescription(false);

    editIssue(currentIssueKey, {
      description: value,
    });
  };

  const handleKeyBlur = (value: string) => {
    if (!currentIssueKey) return;

    const keyAlreadyExists =
      !!pokerTable.issues &&
      !!pokerTable.issues.find((issue) => issue.key === value);

    if (keyAlreadyExists) {
      showNotification({
        title: 'Issue key already exists',
        content:
          'There is another issue in the game with the same Key, please choose a different one.',
        style: 'error',
      });
      return;
    }

    setCurrentIssueKey(value);

    editIssue(currentIssueKey, {
      key: value,
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);

    if (currentIssue) {
      deleteIssue(currentIssue);
    }

    onClose();
  };

  if (!currentIssue) return null;

  return (
    <>
      <Modal
        width="big"
        onClose={handleCloseModal}
        actionsTopBar={
          <ButtonIcon
            onClick={handleDeleteClick}
            icon={<Icon icon="trash" />}
            tooltip="Delete issue"
          />
        }
      >
        <div className={styles['issue-modal']}>
          <div className={styles['key-container']}>
            <TextareaInlineEdit
              mode="key"
              buttonLabel="Add key"
              value={currentIssue.key}
              onBlur={handleKeyBlur}
            />
          </div>
          <div className={styles['summary-container']}>
            <TextareaInlineEdit
              mode="summary"
              buttonLabel="Add summary"
              value={currentIssue.summary}
              onBlur={handleSummaryBlur}
            />
          </div>

          <VerticalSpacing spacing="spacing-xl" />

          <div className={styles['link-container']}>
            <span className={styles['label']}>
              <span className={styles['label__span']}>Link</span>
              {!!currentIssue.url && issue.provider !== 'jira' && (
                <ButtonIcon
                  onClick={() => setIsFocusLink(true)}
                  icon={<Icon icon="pencil" />}
                />
              )}
            </span>

            <VerticalSpacing
              spacing={
                !!currentIssue.url && issue.provider !== 'jira'
                  ? 'spacing-xxs'
                  : 'spacing-m'
              }
            />

            {issue.provider === 'jira' ? (
              <a href={currentIssue.url || ''}>{currentIssue.url || ''}</a>
            ) : (
              <TextareaInlineEdit
                mode="url"
                buttonLabel="Add a link to the issue..."
                value={currentIssue.url || ''}
                onBlur={handleLinkBlur}
                isFocus={isFocusLink}
              />
            )}
          </div>

          <VerticalSpacing spacing="spacing-xl" />

          <div className={styles['description-container']}>
            <span className={styles['label']}>
              <span className={styles['label__span']}>Description</span>
              {!!currentIssue.description && issue.provider !== 'jira' && (
                <ButtonIcon
                  onClick={() => setIsFocusDescription(true)}
                  icon={<Icon icon="pencil" />}
                />
              )}
            </span>

            <VerticalSpacing
              spacing={
                !!currentIssue.description && issue.provider !== 'jira'
                  ? 'spacing-xs'
                  : 'spacing-m'
              }
            />

            {issue.provider === 'jira' && (
              <JiraDescription description={currentIssue.description || ''} />
            )}

            {issue.provider !== 'jira' && (
              <TextareaInlineEdit
                mode="description"
                buttonLabel="Add a description..."
                value={currentIssue.description || ''}
                onBlur={handleDescriptionBlur}
                isFocus={isFocusDescription}
              />
            )}
          </div>
          <VerticalSpacing spacing="spacing-xl" />
          <div className={styles['issue-modal__footer']}>
            <div>
              <ButtonActivable
                isActive={!!currentIssue.isVotingNow}
                onIsActiveChange={(isActive) => {
                  if (isActive) {
                    setVotingIssue(currentIssue);

                    if (pokerTable.id && pokerTable.cardsUp) {
                      hideCards(pokerTable.id);
                    }
                  } else {
                    unsetVotingIssue();
                  }
                }}
                onClick={(event) => event.stopPropagation()}
              >
                {!!currentIssue.isVotingNow
                  ? 'Voting now...'
                  : 'Vote this issue'}
              </ButtonActivable>
            </div>
            <div className={styles['issue-modal__points']}>
              <PointsPicker
                align="left-top"
                value={
                  currentIssue.storyPoints || currentIssue.storyPoints === 0
                    ? currentIssue.storyPoints
                    : null
                }
                onChange={(card: string | null) => {
                  editIssue(currentIssue.key, { storyPoints: card });
                }}
                deck={pokerTable.deck}
                overBackgroundColor="white"
              />
            </div>
          </div>
        </div>
      </Modal>
      {isDeleteConfirmOpen && (
        <ConfirmModal
          isDanger
          title="Are you sure you want to delete this issue?"
          content="This operation is irreversible."
          confirmLabel="Delete issue"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </>
  );
};
