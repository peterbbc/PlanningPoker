import {
  ButtonIcon,
  Icon,
  useLocation,
  ConfirmModal,
} from '../../../../../packages/react-base';
import { navigate } from '@reach/router';
import React, { useEffect, useRef, useState } from 'react';
import useCurrentUser from '../../../../spaces/auth/hooks/useCurrentUser';
import { useCurrentTable } from '../../../../spaces/poker-table/hooks/useCurrentTable';

import { JiraCredentialsModal } from '../../../JiraCredentialsModal/JiraCredentialsModal';
import { JiraSettingsModal } from '../../../JiraSettingsModal/JiraSettingsModal';
import { SaveInJiraModal } from '../../SaveInJiraModal/SaveInJiraModal';
import styles from './ImportDropdown.module.scss';
import { SavedInJiraTooltip } from './SaveInJiraTooltip';

export const SaveInJiraButton = () => {
  const query = useQuery();

  const isRedirectedFromJira = query.get('jira-callback') === 'true';
  const pathname = useLocation().pathname;

  const [isSaveInJiraModalOpen, setIsSaveInJiraModalOpen] = useState(false);
  const [isJiraSettingsModalOpen, setIsJiraSettingsModalOpen] = useState(false);
  const [isJiraCredentialsModalOpen, setIsJiraCredentialsModalOpen] = useState(false);
  const [isNoIssuesModalOpen, setIsNoIssuesModalOpen] = useState(false);

  const [hasClickedSavedInJira, setHasClickedSavedInJira] = useState(false);
  const toggleButtonRef = useRef<HTMLDivElement>(null);

  const { pokerTable } = useCurrentTable();
  const { uid } = useCurrentUser();

  const canSaveInJira =
    pokerTable &&
    uid &&
    !!pokerTable.issues &&
    pokerTable.issues.some((issue) => issue.addedByUid === uid);

  const issuesToUpdate =
    !!pokerTable &&
    !!uid &&
    !!pokerTable.issues &&
    pokerTable.issues
      .map((issue) => ({
        ...issue,
        storyPoints: issue.storyPoints === '½' ? 0.5 : issue.storyPoints,
      }))
      .filter(
        (issue) =>
          issue.addedByUid === uid &&
          !!issue.id &&
          (issue.storyPoints || issue.storyPoints === 0) &&
          !isNaN(Number(issue.storyPoints)),
      )
      .map((issue) => ({
        ...issue,
        storyPoints: Number(issue.storyPoints),
      }));

  const openModal = () => {
    if (!issuesToUpdate || issuesToUpdate.length === 0) {
      setIsNoIssuesModalOpen(true);

      return;
    }

    setIsSaveInJiraModalOpen(true);
  };

  useEffect(() => {
    const reason = localStorage.getItem('jira-requires-auth-reason');

    if (isRedirectedFromJira && reason === 'save-issues') {
      localStorage.removeItem('jira-requires-auth-reason');
      setIsSaveInJiraModalOpen(true);

      navigate(pathname);
    }
  }, [isRedirectedFromJira, pathname]);

  if (!canSaveInJira) return null;

  return (
    <>
      <div className={styles.wrapper} ref={toggleButtonRef}>
        <ButtonIcon
          onClick={() => {
            if (!hasClickedSavedInJira) {
              setHasClickedSavedInJira(true);
            }

            openModal();
          }}
          icon={<Icon icon="save" />}
          buttonColor="primary"
          tooltip="Save story points in Jira"
        />
      </div>

      {isNoIssuesModalOpen && (
        <ConfirmModal
          onClose={() => setIsNoIssuesModalOpen(false)}
          title="Oops, there are no issues to save."
          content="Please select story points on the issues you want to save."
          confirmLabel="Ok, take me back"
          cancelLabel="Cancel"
          onCancel={() => setIsNoIssuesModalOpen(false)}
          onConfirm={() => setIsNoIssuesModalOpen(false)}
        />
      )}
      {isSaveInJiraModalOpen && (
        <SaveInJiraModal
          issuesToUpdate={issuesToUpdate || []}
          onClose={() => setIsSaveInJiraModalOpen(false)}
          onClickSettingsButton={() => {
            setIsJiraSettingsModalOpen(true);
            setIsSaveInJiraModalOpen(false);
          }}
          onRequiresJiraAuth={() => {
            setIsSaveInJiraModalOpen(false);
            setIsJiraCredentialsModalOpen(true);
          }}
        />
      )}

      {isJiraCredentialsModalOpen && (
        <JiraCredentialsModal
          onClose={() => setIsJiraCredentialsModalOpen(false)}
          reason="save-issues"
        />
      )}

      {isJiraSettingsModalOpen && (
        <JiraSettingsModal
          onClose={() => {
            setIsJiraSettingsModalOpen(false);
          }}
          onClickBack={() => {
            setIsJiraSettingsModalOpen(false);
            setIsSaveInJiraModalOpen(true);
          }}
          onRequiresAuth={() => {
            setIsJiraCredentialsModalOpen(true);
            setIsJiraSettingsModalOpen(false);
          }}
        />
      )}

      <SavedInJiraTooltip
        refNode={toggleButtonRef}
        hasClickedSavedInJira={hasClickedSavedInJira}
        canSaveInJira={canSaveInJira}
      />
    </>
  );
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
