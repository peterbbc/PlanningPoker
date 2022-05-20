import {
  ButtonIcon,
  ConfirmModal,
  HoritzontalSpacing,
  Icon,
  Paragraph,
  VerticalSpacing,
  FlexBox,
  ButtonLink,
} from '../../../../packages/react-base';
import { Issue } from '../../../../packages/types-planning-poker';
import React, { ReactNode, useEffect, useState } from 'react';
import { useAppContext } from '../../../spaces/app/hooks/useAppContext';
import {
  jiraEditIssues,
  JiraIssueToUpdate,
} from '../../../spaces/jira/data/jira';
import { useJiraProperties } from '../../../spaces/jira/hooks/useJiraProperties';
import { useNotification } from '../../../spaces/notifications/useNotification';

import styles from './SaveInJiraModal.module.scss';

interface SaveInJiraModalProps {
  issuesToUpdate: Issue[];
  onClose: () => void;
  onRequiresJiraAuth: () => void;
  onClickSettingsButton: () => void;
}

export const SaveInJiraModal = ({
  issuesToUpdate,
  onClose,
  onRequiresJiraAuth,
  onClickSettingsButton,
}: SaveInJiraModalProps) => {
  const [error, setError] = useState<ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { showNotification } = useNotification();

  const setContactModalOpen = useAppContext().contactModal[1];

  const { jiraProperties, isFirstTime } = useJiraProperties();

  useEffect(() => {
    if (isFirstTime) {
      onRequiresJiraAuth();
    }
  }, [isFirstTime, onRequiresJiraAuth]);

  const handleClose = () => {
    setError(null);
    setIsLoading(false);

    onClose();
  };

  const handleRequiresJiraAuth = () => {
    setError(null);
    setIsLoading(false);

    onRequiresJiraAuth();
  };

  const handleSaveClick = () => {
    setError(null);

    const selectedStoryPointsField =
      jiraProperties?.selectedStoryPointsField?.id;

    if (!selectedStoryPointsField) {
      setError(
        'Please configure the story points field in your Jira settings.',
      );

      return;
    }

    setIsLoading(true);

    const jiraIssuesToUpdate: JiraIssueToUpdate[] = issuesToUpdate.map(
      (issue) => ({
        id: (issue.id || '').toString(),
        fields: {
          [selectedStoryPointsField]: issue.storyPoints,
        },
      }),
    );

    jiraEditIssues(jiraIssuesToUpdate, handleRequiresJiraAuth)
      .then(() => {
        setIsLoading(false);

        showNotification({
          title: `${jiraIssuesToUpdate.length} issue(s) have been updated in JIRA`,
          content: 'You can see the updated issues in JIRA',
        });

        handleClose();
      })
      .catch(({ error }) => {
        console.error(error);

        setIsLoading(false);

        if (
          error?.code !== 'unauthenticated' &&
          error?.code !== 'failed-precondition'
        ) {
          showNotification({
            style: 'error',
            title: 'Oops, we got an error on saving',
            content:
              error?.message ||
              'Please try again or change your settings from the "Import from JIRA modal"',
          });
        }

        if (
          error?.code === 'failed-precondition' ||
          error?.code === 'functions/failed-precondition'
        ) {
          setError(error.message);
        }
      });
  };

  return (
    <ConfirmModal
      onClose={handleClose}
      onConfirm={handleSaveClick}
      onCancel={handleClose}
      confirmLabel={`Update ${issuesToUpdate.length} issue${
        issuesToUpdate.length > 1 ? 's' : ''
      }`}
      cancelLabel="No, take me back"
      isLoading={isLoading}
      actionsTopBar={
        <ButtonIcon
          onClick={onClickSettingsButton}
          icon={<Icon icon="cog" />}
          tooltip="Settings"
        />
      }
      title="Do you want to update story points in JIRA?"
      content="The story points of issues originally imported by you will be saved back to JIRA."
      error={
        error && (
          <div>
            <VerticalSpacing spacing="spacing-m" />
            <div className={styles['message-error']}>
              <FlexBox alignItems="center">
                <Icon icon="info" />
                <HoritzontalSpacing spacing="spacing-m" />
                <span>Oops! We can’t update your story points.</span>
              </FlexBox>
            </div>
            <VerticalSpacing spacing="spacing-m" />
            <Paragraph>
              To solve this problem, please add the{' '}
              <b>{`“${jiraProperties?.selectedStoryPointsField?.name}”`}</b>{' '}
              field to the screen(s) in your JIRA settings.
            </Paragraph>
            <VerticalSpacing spacing="spacing-m" />
            <Paragraph>
              For more information, follow{' '}
              <a
                href="https://support.atlassian.com/jira-cloud-administration/docs/add-a-custom-field-to-a-screen/"
                target="_blank"
                rel="noopener noreferrer"
              >
                this instructions
              </a>
            </Paragraph>
            <VerticalSpacing spacing="spacing-m" />
            <Paragraph>
              Please, feel free to{' '}
              <ButtonLink onClick={() => setContactModalOpen(true)}>
                contact us
              </ButtonLink>{' '}
              if you are still facing issues.
            </Paragraph>
            <VerticalSpacing spacing="spacing-xl" />
          </div>
        )
      }
    />
  );
};
