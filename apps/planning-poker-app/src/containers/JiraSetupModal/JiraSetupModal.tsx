import {
  FormSelect,
  Modal,
  ModalTitle,
  Paragraph,
  SelectValue,
  SubmitRow,
  useLocation,
  VerticalSpacing,
  FlexBox,
} from '@we-agile-you/react-base';
import React, { useEffect, useState } from 'react';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import {
  fetchJiraProperties,
  jiraHandleAuth,
  jiraRefreshProperties,
  jiraUpdateAction,
} from '../../spaces/jira/data/jira';
import { useJiraActions } from '../../spaces/jira/hooks/useJiraActions';
import { JiraProperties } from '../../spaces/jira/types';
import { useNotification } from '../../spaces/notifications/useNotification';

import styles from './JiraSetupModal.module.scss';
import { useDispatch } from 'react-redux';
import { Loader } from '../../components/molecules/Loader/Loader';
import { navigate } from 'gatsby';

export type JiraRedirectState = {
  code?: string;
};

interface JiraSetupModalProps {
  onClose: () => void;
  onSaved: () => void;
  authCode: string;
  reason: string;
}

type FieldOption = {
  label: string;
  value: any;
};

export const JiraSetupModal = ({
  authCode,
  onClose,
  onSaved,
  reason,
}: JiraSetupModalProps) => {
  const { uid } = useCurrentUser();
  const [accessibleResources, setAccessibleResources] = useState<any[] | null>(
    null,
  );
  const [fieldOptions, setFieldOptions] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState<string | false>(false);
  const [isReady, setIsReady] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [selectedFieldOption, setSelectedFieldOption] =
    useState<SelectValue<FieldOption>>(null);
  const [selectedResourceIndex, setSelectedResourceIndex] = useState<
    number | null
  >(null);
  const { updateJiraProperties } = useJiraActions({
    onRequiresAuth: onClose,
  });
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  const pathname = useLocation().pathname;

  const handleResourceSelected = async (
    resourceIndex: number,
    accessibleResources: any[],
  ) => {
    if (!uid || !accessibleResources?.length) {
      throw new Error('Error handling Resource selection');
    }

    setIsLoading(`Getting site's information, this can take some minutes...`);

    setFieldOptions(null);
    setSelectedFieldOption(null);
    setSelectedResourceIndex(resourceIndex);

    const selectedResource =
      accessibleResources && accessibleResources[resourceIndex];

    const newJiraProperties: JiraProperties = await jiraRefreshProperties(
      reason === 'setup',
      onClose,
      selectedResource,
    );

    if (!newJiraProperties) {
      throw new Error('Error refreshing Jira properties');
    }

    dispatch(jiraUpdateAction(newJiraProperties));

    const fieldOptions: FieldOption[] = newJiraProperties.fields.map(
      (field: any) => ({
        value: field,
        label: `${field.name} (${field.key})`,
      }),
    );

    const previouseSelectedField = newJiraProperties?.selectedStoryPointsField;

    const previousSelectedOption = previouseSelectedField
      ? fieldOptions.find(
          (option) => option.value.key === previouseSelectedField.key,
        )
      : null;

    const guessedFieldOption = newJiraProperties.guessedStoryPointsField
      ? fieldOptions.find(
          (option) =>
            option.value.key === newJiraProperties.guessedStoryPointsField.key,
        )
      : null;

    setFieldOptions(fieldOptions);
    setSelectedFieldOption(
      previousSelectedOption || guessedFieldOption || null,
    );

    setIsLoading(false);

    return !!previousSelectedOption;
  };

  useEffect(() => {
    if (!authCode || !uid || !isIdle) return;

    setIsLoading('Handling Jira authentication...');
    setIsIdle(false);

    fetchJiraProperties(uid).then((jiraProperties) => {
      jiraHandleAuth(authCode, reason === 'setup')
        .then(async (accessibleResources) => {
          navigate(pathname, { replace: true });

          if (!uid || !accessibleResources?.length) {
            throw new Error('Error handling Jira authentication response');
          }

          const previousSelectedResourceId =
            jiraProperties?.selectedResource?.id;

          const previousSelectedResourceIndex = previousSelectedResourceId
            ? accessibleResources.findIndex(
                (resource) => resource.id === previousSelectedResourceId,
              )
            : -1;

          const isResourceSelectedFromPrevious =
            previousSelectedResourceIndex > -1;

          setAccessibleResources(accessibleResources);
          const isFieldSelectedFromPrevious = await handleResourceSelected(
            isResourceSelectedFromPrevious ? previousSelectedResourceIndex : 0,
            accessibleResources,
          );

          if (
            reason !== 'setup' &&
            isResourceSelectedFromPrevious &&
            isFieldSelectedFromPrevious
          ) {
            onSaved();
          } else {
            setIsReady(true);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          showNotification({
            style: 'error',
            title: error.message || 'Error handling Jira authentication',
          });
          onClose();
        });
    });
  }, [uid, authCode, isIdle, pathname]);

  const handleSelectResource = (option: any) => {
    if (!accessibleResources) return;

    const realOption =
      Array.isArray(option) && option.length > 0 ? option[0] : option;

    const resourceIndex = Number(realOption.value);

    handleResourceSelected(resourceIndex, accessibleResources).catch(
      (error) => {
        setIsLoading(false);
        showNotification({
          style: 'error',
          title: error.message || 'Error getting resource information.',
        });
      },
    );
  };

  const handleConfirm = () => {
    const field =
      Array.isArray(selectedFieldOption) && selectedFieldOption.length > 0
        ? selectedFieldOption[0]
        : selectedFieldOption;

    const value = field?.value;

    const selectedResource =
      accessibleResources &&
      selectedResourceIndex !== null &&
      accessibleResources[selectedResourceIndex];

    if (!uid || !value || !selectedResource) {
      showNotification({
        style: 'error',
        title: 'Selected options are not correct',
      });
      return;
    }

    updateJiraProperties(uid, {
      selectedResource,
      selectedStoryPointsField: value,
    }).then(() => {
      onSaved();
    });
  };

  const resourcesOptions = accessibleResources?.map((resource, i) => ({
    label: resource.name,
    value: `${i}`,
  }));

  return (
    <Modal isNotClosable>
      <div className={styles.wrapper}>
        {isReady && (
          <div>
            <ModalTitle>Just one more step</ModalTitle>
            {accessibleResources &&
              accessibleResources.length > 1 &&
              selectedResourceIndex !== null && (
                <div>
                  <VerticalSpacing spacing="spacing-xl" />
                  <Paragraph color="grey600">
                    Which site do you want to use?
                  </Paragraph>
                  <VerticalSpacing spacing="spacing-s" />
                  <FormSelect
                    value={
                      resourcesOptions?.length &&
                      resourcesOptions[selectedResourceIndex]
                    }
                    label="Site"
                    options={resourcesOptions}
                    onChange={handleSelectResource}
                  />
                </div>
              )}
            {fieldOptions && (
              <div>
                <VerticalSpacing spacing="spacing-xl" />
                <Paragraph color="grey600">
                  Which Story Points Field do you use in JIRA?
                </Paragraph>
                <VerticalSpacing spacing="spacing-xs" />
                <Paragraph color="grey500" size="small">
                  * You can change this later
                </Paragraph>
                <VerticalSpacing spacing="spacing-s" />
                <FormSelect
                  value={selectedFieldOption}
                  label="Story points field"
                  options={fieldOptions}
                  menuPortalTarget={document.body}
                  onChange={(option) => setSelectedFieldOption(option)}
                />
              </div>
            )}
          </div>
        )}

        {(isIdle || isLoading) && (
          <>
            <VerticalSpacing spacing="spacing-m" />
            <FlexBox justifyContent="center">
              <Loader message={isLoading || 'Please wait...'} />
            </FlexBox>
            <VerticalSpacing spacing="spacing-xxl" />
          </>
        )}

        <VerticalSpacing spacing="spacing-xxl" />

        {isReady && (
          <SubmitRow
            align="strech"
            cancelLabel="Cancel"
            confirmLabel="Save and continue"
            onConfirm={handleConfirm}
            onCancel={onClose}
            isDisabled={!selectedFieldOption}
          />
        )}
      </div>
    </Modal>
  );
};
