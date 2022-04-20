import { ButtonDropdown, ConfirmModal, Icon } from '@we-agile-you/react-base';
import { ContextMenu } from '@we-agile-you/react-base/molecules/ContextMenu/ContextMenu';
import React, { useState } from 'react';
import { useIssueActions } from '../../../../spaces/poker-table/hooks/useIssueActions';
import { DownloadIssuesModal } from '../../../DownloadIssuesModal/DownloadIssuesModal';

export const ExtraActionsDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isDownloadIssuesModalOpen, setIsDownloadIssuesModalOpen] =
    useState(false);

  const { deleteAll } = useIssueActions();

  return (
    <>
      <ButtonDropdown
        isOpen={isDropdownOpen}
        onIsOpenChange={setIsDropdownOpen}
        isIconButton
        color="secondary"
        buttonTooltip="More actions"
        dropdown={
          <ContextMenu
            elements={[
              {
                label: 'Download issues as CSV',
                onClick: () => {
                  setIsDropdownOpen(false);
                  setIsDownloadIssuesModalOpen(true);
                },
                icon: 'export',
              },
              {
                label: 'Delete all issues',
                onClick: () => {
                  setIsDropdownOpen(false);
                  setIsDeleteAllModalOpen(true);
                },
                icon: 'trash',
              },
            ]}
          />
        }
      >
        <Icon icon="ellipsis-v" />
      </ButtonDropdown>
      {isDeleteAllModalOpen && (
        <ConfirmModal
          isDanger
          title="Wait! Are you sure you want to delete all issues?"
          content="Once you confirm, you will not be able to recover them."
          cancelLabel="Cancel"
          confirmLabel="Delete issues"
          onClose={() => setIsDeleteAllModalOpen(false)}
          onCancel={() => setIsDeleteAllModalOpen(false)}
          onConfirm={() => {
            setIsDeleteAllModalOpen(false);
            deleteAll();
          }}
        />
      )}
      {isDownloadIssuesModalOpen && (
        <DownloadIssuesModal
          onClose={() => setIsDownloadIssuesModalOpen(false)}
        />
      )}
    </>
  );
};
