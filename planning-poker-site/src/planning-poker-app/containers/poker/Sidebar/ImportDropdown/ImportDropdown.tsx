import { ButtonDropdown, Icon } from '../../../../../packages/react-base';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ContextMenu } from '../../../../../packages/react-base';
import { ImportFromJiraModal } from '../../../ImportFromJiraModal/ImportFromJiraModal';
import { ImportFromUrlsModal } from '../../../ImportFromUrlsModal/ImportFromUrlsModal';
import { JiraCredentialsModal } from '../../../JiraCredentialsModal/JiraCredentialsModal';
import { JiraSettingsModal } from '../../../JiraSettingsModal/JiraSettingsModal';
import { JiraSetupHandler } from '../../../JiraSetupModal/JiraSetupHandler';
import styles from './ImportDropdown.module.scss';
import { ImportTooltip } from './ImportTooltip';
import { useJiraProperties } from '../../../../spaces/jira/hooks/useJiraProperties';
import useCurrentUser from '../../../../spaces/auth/hooks/useCurrentUser';
import { ImportFromFileModal } from '../../../ImportFromFileModal/ImportFromFileModal';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../../../vendors/hotjar/identify';
import { useJiraActions } from '../../../../spaces/jira/hooks/useJiraActions';

export const ImportDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { uid } = useCurrentUser();
  const [isImportFromJiraModalOpen, setIsImportFromJiraModalOpen] =
    useState(false);
  const [isImportFromFileModalOpen, setIsImportFromFileModalOpen] =
    useState(false);
  const [isJiraRequiresAuthModalOpen, setIsJiraRequiresAuthModalOpen] =
    useState(false);
  const [isImportFromUrlsModalOpen, setIsImportFromUrlsModalOpen] =
    useState(false);
  const [isJiraSettingsModalOpen, setIsJiraSettingsModalOpen] = useState(false);
  const [hasOpenedImportDropdown, setHasOpenedImportDropdown] = useState(false);
  const [isJiraCredentialsReady, setIsJiraCredentialsReady] = useState<
    boolean | null
  >(null);

  const onRequiresAuth = useMemo(
    () => () => setIsJiraCredentialsReady(false),
    [],
  );

  const { jiraGetPermissions } = useJiraActions({
    onRequiresAuth,
  });
  const toggleButtonRef = useRef<HTMLDivElement>(null);
  const { isFirstTime, jiraProperties } = useJiraProperties();
  const resourceId = jiraProperties?.selectedResource?.id;
  const token = jiraProperties?.token;

  useEffect(() => {
    if (!resourceId) return;

    jiraGetPermissions()
      .then(() => setIsJiraCredentialsReady(true))
      .catch(() => setIsJiraCredentialsReady(false));
  }, [jiraGetPermissions, resourceId, token]);

  const handleImportFromJiraClick = () => {
    const userId = uid || null;

    hotjarIdentify(HOTJAR_IDENTIFY_KEYS.CLICKED_IMPORT_FROM_JIRA, userId);

    if (isFirstTime || isJiraCredentialsReady === false) {
      setIsJiraRequiresAuthModalOpen(true);
    } else {
      setIsImportFromJiraModalOpen(true);
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.wrapper} ref={toggleButtonRef}>
        <ButtonDropdown
          isOpen={isOpen}
          onIsOpenChange={() => {
            if (!hasOpenedImportDropdown) {
              setHasOpenedImportDropdown(true);
            }

            setIsOpen(!isOpen);
          }}
          isIconButton
          size="s"
          buttonTooltip="Import issues"
          dropdown={
            <ContextMenu
              elements={[
                {
                  label: 'Import from JIRA',
                  onClick: handleImportFromJiraClick,
                },
                {
                  label: 'Add from urls',
                  onClick: () => {
                    setIsImportFromUrlsModalOpen(true);
                    setIsOpen(false);
                  },
                },
                {
                  label: 'Import from CSV',
                  onClick: () => {
                    setIsImportFromFileModalOpen(true);
                    setIsOpen(false);
                  },
                },
              ]}
            />
          }
        >
          <Icon icon="import" />
        </ButtonDropdown>
      </div>

      <JiraSetupHandler
        onSaved={() => {
          setIsImportFromJiraModalOpen(true);
        }}
      />

      {isImportFromJiraModalOpen && (
        <ImportFromJiraModal
          onRequiresAuth={() => {
            setIsJiraRequiresAuthModalOpen(true);
            setIsImportFromJiraModalOpen(false);
          }}
          onClickSettingsButton={() => {
            setIsJiraSettingsModalOpen(true);
            setIsImportFromJiraModalOpen(false);
          }}
          onClose={() => setIsImportFromJiraModalOpen(false)}
        />
      )}

      {isImportFromFileModalOpen && (
        <ImportFromFileModal
          onClose={() => setIsImportFromFileModalOpen(false)}
        />
      )}

      {isJiraRequiresAuthModalOpen && (
        <JiraCredentialsModal
          onClose={() => setIsJiraRequiresAuthModalOpen(false)}
          reason="import-issues"
        />
      )}

      {isJiraSettingsModalOpen && (
        <JiraSettingsModal
          onClose={() => {
            setIsJiraSettingsModalOpen(false);
          }}
          onClickBack={() => {
            setIsJiraSettingsModalOpen(false);
            setIsImportFromJiraModalOpen(true);
          }}
          onRequiresAuth={() => {
            setIsJiraRequiresAuthModalOpen(true);
            setIsJiraSettingsModalOpen(false);
          }}
        />
      )}

      {isImportFromUrlsModalOpen && (
        <ImportFromUrlsModal
          onClose={() => setIsImportFromUrlsModalOpen(false)}
        />
      )}

      <ImportTooltip
        refNode={toggleButtonRef}
        hasOpenedImportDropdown={hasOpenedImportDropdown}
      />
    </>
  );
};
