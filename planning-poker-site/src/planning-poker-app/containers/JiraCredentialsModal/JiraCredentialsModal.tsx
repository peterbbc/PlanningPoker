import {
  Header4,
  Modal,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '../../../packages/react-base';
import React, { useEffect, useState } from 'react';
import { RobotImage } from '../../components/atoms/RobotImage/RobotImage';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { getJiraOauthLink } from '../../spaces/jira/data/jira';
import { useJiraProperties } from '../../spaces/jira/hooks/useJiraProperties';
import { useCurrentTable } from '../../spaces/poker-table/hooks/useCurrentTable';

import styles from './JiraCredentialsModal.module.scss';

interface JiraCredentialsModalProps {
  reason: 'save-issues' | 'import-issues';
  onClose: () => void;
}

export const JiraCredentialsModal = ({
  reason,
  onClose,
}: JiraCredentialsModalProps) => {
  const { pokerTable } = useCurrentTable();
  const { uid } = useCurrentUser();

  const [isLoadingRedirect, setIsLoadingRedirect] = useState(false);

  const { isFirstTime } = useJiraProperties();

  const jiraRequiresAuthUrl = getJiraOauthLink(uid || '', pokerTable.id || '');

  useEffect(() => {
    if (isLoadingRedirect && uid) {
      localStorage.setItem('jira-requires-auth-reason', reason || 'setup');
      window.location.href = jiraRequiresAuthUrl;
    }
  }, [isLoadingRedirect, uid]);

  return (
    <Modal width="auto" onClose={onClose}>
      {isFirstTime ? (
        <div>
          <Paragraph align="center">
            <RobotImage className={styles.image} image="happy-cable" />
          </Paragraph>
          <VerticalSpacing spacing="spacing-xl" />
          <Header4 align="center">Welcome to JIRA import !</Header4>
          <VerticalSpacing spacing="spacing-m" />
          <Paragraph color="grey500" align="center">
            It looks like it’s the first time you import issues from JIRA.
            <br />
            We need you to allow us access to your Atlassian account.
          </Paragraph>
          <VerticalSpacing spacing="spacing-xxl" />
          <SubmitRow
            cancelLabel="No, take me back"
            onCancel={onClose}
            confirmLabel="Let's Go !"
            align="strech"
            isLoading={isLoadingRedirect}
            onConfirm={() => {
              setIsLoadingRedirect(true);
            }}
          />
        </div>
      ) : (
        <div>
          <Paragraph align="center">
            <RobotImage className={styles.image} image="disconected" />
          </Paragraph>
          <VerticalSpacing spacing="spacing-xl" />
          <Header4 align="center">
            Oops! Your JIRA session has expired...
          </Header4>
          <VerticalSpacing spacing="spacing-m" />
          <Paragraph color="grey500" align="center">
            JIRA only allow us to save your credentials for 1 hour. You’ll need
            to refresh them to continue editing your issues.
          </Paragraph>
          <VerticalSpacing spacing="spacing-xxl" />
          <SubmitRow
            cancelLabel="No, take me back"
            onCancel={onClose}
            confirmLabel="Refresh JIRA credentials"
            align="strech"
            isLoading={isLoadingRedirect}
            onConfirm={() => {
              setIsLoadingRedirect(true);
            }}
          />
        </div>
      )}
    </Modal>
  );
};
