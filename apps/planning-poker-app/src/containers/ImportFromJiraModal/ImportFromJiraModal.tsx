import {
  ButtonIcon,
  ConfirmModal,
  Icon,
  Paragraph,
  SubmitRow,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import { Issue } from '@we-agile-you/types-planning-poker';
import React, { useEffect, useMemo, useState } from 'react';
import { Loader } from '../../components/molecules/Loader/Loader';
import { VerticalDividerWithScroll } from '../../components/molecules/VerticalDividerWithScroll/VerticalDividerWithScroll';
import { JiraFilters } from '../../components/organisms/JiraFilters/JiraFilters';
import { JiraIssueList } from '../../components/organisms/JiraIssueList/JiraIssueList';
import { ModalWithSidebar } from '../../components/organisms/ModalWithSidebar/ModalWithSidebar';
import { useJiraActions } from '../../spaces/jira/hooks/useJiraActions';
import { useJiraProperties } from '../../spaces/jira/hooks/useJiraProperties';
import { FetchIssuesFilters } from '../../spaces/jira/types';
import { useNotification } from '../../spaces/notifications/useNotification';
import { useIssueActions } from '../../spaces/poker-table/hooks/useIssueActions';
import styles from './ImportFromJiraModal.module.scss';
import arrow from './arrow.svg';

interface ImportFromJiraModalProps {
  onClose: () => void;
  onRequiresAuth: () => void;
  onClickSettingsButton: () => void;
}

export const ImportFromJiraModal = ({
  onClose,
  onRequiresAuth,
  onClickSettingsButton,
}: ImportFromJiraModalProps) => {
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Issue[] | null>(null);
  const { showNotification } = useNotification();

  const resetState = useMemo(
    () => () => {
      setIsLoadingIssues(false);
      setIssues(null);
      setSelectedIssues(null);
    },
    [],
  );

  const { fetchIssues } = useJiraActions({
    onRequiresAuth: () => {
      resetState();
      onRequiresAuth();
    },
  });
  const { jiraProperties, isFirstTime } = useJiraProperties();
  const { addJiraIssues } = useIssueActions();

  const { projects, statuses, issueTypes } = jiraProperties || {
    projects: [],
    statuses: [],
    issueTypes: [],
  };

  useEffect(() => {
    if (isFirstTime) {
      resetState();
      onRequiresAuth();

      return;
    }
  }, [isFirstTime, onRequiresAuth, resetState]);

  const handleClose = (dontCheck = false) => {
    if (!!issues?.length && !dontCheck) {
      setIsConfirmModalOpen(true);

      return;
    }

    resetState();
    onClose();
  };

  const handleConfirm = async () => {
    if (selectedIssues) {
      await addJiraIssues(selectedIssues, jiraProperties?.selectedResource.url);
    }

    handleClose(true);
  };

  const handleApplyFilters = (filters: FetchIssuesFilters) => {
    setIsLoadingIssues(true);

    fetchIssues(filters)
      .then((issues) => {
        setIssues(issues);
        setIsLoadingIssues(false);
      })
      .catch((e) => {
        const errorCode = e.error ? e.error.code : e.code;

        console.error(e);

        setIsLoadingIssues(false);

        if (
          errorCode !== 'unauthenticated' &&
          errorCode !== 'functions/unauthenticated'
        ) {
          showNotification({
            style: 'error',
            title: 'Search error',
            content: e.message || 'Please try again with diferent filters',
          });
        }
      });
  };

  return (
    <>
      <ModalWithSidebar
        onClose={() => handleClose()}
        title="Import from JIRA"
        actionsTopBar={
          <ButtonIcon
            onClick={onClickSettingsButton}
            icon={<Icon icon="cog" />}
            tooltip="Settings"
          />
        }
        sidebar={
          <JiraFilters
            isLoading={isLoadingIssues}
            projects={projects}
            statuses={statuses}
            issueTypes={issueTypes}
            onApplyFilters={handleApplyFilters}
          />
        }
        content={
          <VerticalDividerWithScroll
            content={
              <>
                {isLoadingIssues ? (
                  <div className={styles.loader}>
                    <Loader message="Getting issues from JIRA..." />
                  </div>
                ) : (
                  <>
                    {!!issues?.length ? (
                      <JiraIssueList
                        issues={issues}
                        selectedIssues={selectedIssues || []}
                        onSelectedIssuesChange={(issues) =>
                          setSelectedIssues(issues)
                        }
                      />
                    ) : (
                      <div className={styles.placeholder}>
                        <img src={arrow} alt="Arrow" />
                        <VerticalSpacing spacing="spacing-xl" />
                        {issues?.length === 0 && (
                          <>
                            <Paragraph fontWeight="bold" align="center">
                              No results yet...
                            </Paragraph>
                          </>
                        )}
                        <Paragraph color="grey500" align="center">
                          Please, search issues on the left
                        </Paragraph>
                      </div>
                    )}
                  </>
                )}
              </>
            }
            bottomContent={
              <div className={styles.bottom}>
                {!!issues && (
                  <SubmitRow
                    align="strech"
                    onCancel={() => handleClose()}
                    onConfirm={handleConfirm}
                    cancelLabel="Cancel"
                    confirmLabel={
                      selectedIssues
                        ? `Import ${selectedIssues.length} issues`
                        : 'Import selected issues'
                    }
                    isDisabled={!selectedIssues || !selectedIssues.length}
                  />
                )}
              </div>
            }
          />
        }
      />

      {isConfirmModalOpen && (
        <ConfirmModal
          title="Are you sure you want to close without importing issues?"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => {
            setIsConfirmModalOpen(false);
            handleClose(true);
          }}
          onCancel={() => setIsConfirmModalOpen(false)}
          confirmLabel="Close"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};
