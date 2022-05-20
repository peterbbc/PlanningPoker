import {
  Button,
  ConfirmModal,
  FormSelect,
  Modal,
  ModalTitle,
  Paragraph,
  Span,
  VerticalSpacing,
  SelectValue
} from '../../../packages/react-base';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import {
  jiraRefreshProperties,
  jiraUpdateAction,
} from '../../spaces/jira/data/jira';
import { useJiraActions } from '../../spaces/jira/hooks/useJiraActions';
import { useJiraProperties } from '../../spaces/jira/hooks/useJiraProperties';
import { useNotification } from '../../spaces/notifications/useNotification';

import styles from './JiraSettingsModal.module.scss';

interface JiraSettingsModalProps {
  onClose: () => void;
  onClickBack: () => void;
  onRequiresAuth: () => void;
}

type FieldOption = {
  label: string;
  value: string;
};

export const JiraSettingsModal = ({
  onClose,
  onClickBack,
  onRequiresAuth,
}: JiraSettingsModalProps) => {
  const { uid } = useCurrentUser();
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [
    isConfirmEreaseCredentialsModalOpen,
    setIsConfirmEreaseCredentialsModalOpen,
  ] = useState(false);
  const [isLoadingSaveStoryPoints, setIsLoadingSaveStoryPoints] = useState(
    false,
  );
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState<
    SelectValue<FieldOption>
  >(null);
  const { fields, selectedStoryPointsField } = useJiraProperties()
    .jiraProperties || {
    fields: null,
  };
  const { showNotification } = useNotification();
  const options: FieldOption[] = useMemo(() => {
    return fields
      ? fields.map((field: any) => ({
          value: field,
          label: `${field.name} (${field.key})`,
        }))
      : [];
  }, [fields]);

  const { updateJiraProperties, deleteJiraProperties } = useJiraActions({
    onRequiresAuth,
  });

  useEffect(() => {
    if (selectedStoryPointsField) {
      setSelectedOption({
        value: selectedStoryPointsField.key,
        label: `${selectedStoryPointsField.name} (${selectedStoryPointsField.key})`,
      });
    }
  }, [selectedStoryPointsField]);

  const handleStoryPointsChange = (option: any) => {
    setIsLoadingSaveStoryPoints(true);
    setSelectedOption(option);

    const field =
      Array.isArray(option) && option.length > 0 ? option[0] : option;

    const value = field?.value;
    const label = field?.label;

    if (!uid || !value) return;

    updateJiraProperties(uid, {
      selectedStoryPointsField: value,
    }).then(() => {
      setIsLoadingSaveStoryPoints(false);
      showNotification({
        title: 'Story points field updated.',
        content: (
          <>
            <span>New value is: </span> <b>{label}</b>.
          </>
        ),
      });
    });
  };

  const handleRefreshButtonClick = () => {
    setIsLoadingProperties(true);
    jiraRefreshProperties(false, onRequiresAuth).then((jiraProperties) => {
      dispatch(jiraUpdateAction(jiraProperties));
      setIsLoadingProperties(false);
      showNotification({
        title: 'JIRA properties updated successfully.',
        content: 'You can now import issues using updated filters.',
      });
    });
  };

  const handleDeleteClick = () => {
    setIsConfirmEreaseCredentialsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!uid) return;
    deleteJiraProperties(uid).then(() => {
      onClickBack();
    });
  };

  return (
    <>
      <Modal
        width="auto"
        onClose={onClose}
        showBackButton
        onClickBackButton={onClickBack}
      >
        <div className={styles.wrapper}>
          <ModalTitle>Jira settings</ModalTitle>
          <div>
            <div>
              <Span spanStyle="bold">Story points field</Span>
            </div>
            <VerticalSpacing spacing="spacing-m" />
            <div>
              <FormSelect
                value={selectedOption}
                label="Story points field"
                options={options}
                onChange={(option) => handleStoryPointsChange(option)}
                isLoading={isLoadingSaveStoryPoints}
              />
            </div>
            <VerticalSpacing spacing="spacing-xl" />
            <div>
              <div>
                <Span spanStyle="bold">Properties</Span>
              </div>
              <VerticalSpacing spacing="spacing-m" />
              <Paragraph>
                The imported information from JIRA: Projects, statuses, issue
                types, etc.
              </Paragraph>
              <VerticalSpacing spacing="spacing-m" />
              <Button
                onClick={handleRefreshButtonClick}
                isBlock
                isLoading={isLoadingProperties}
              >
                Refresh from JIRA
              </Button>
            </div>
            <VerticalSpacing spacing="spacing-xxl-3" />
            <div>
              <div>
                <Span spanStyle="bold">Credentials</Span>
              </div>
              <VerticalSpacing spacing="spacing-m" />
              <Paragraph>
                Erease credentials to remove all our stored info related to JIRA
                or to start from scratch with a fresh new JIRA configuration.
              </Paragraph>
              <VerticalSpacing spacing="spacing-m" />
              <Button
                buttonStyle="secondary"
                buttonColor="danger"
                onClick={handleDeleteClick}
                isBlock
              >
                Erease credentials
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      {isConfirmEreaseCredentialsModalOpen && (
        <ConfirmModal
          title="Are you sure you want to erease JIRA credentials?"
          isDanger
          onClose={() => setIsConfirmEreaseCredentialsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmEreaseCredentialsModalOpen(false)}
          confirmLabel="Erease credentials"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};
