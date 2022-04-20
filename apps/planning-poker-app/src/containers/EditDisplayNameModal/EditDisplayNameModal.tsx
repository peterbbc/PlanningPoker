import {
  Button,
  ButtonLink,
  FormGroup,
  FormInput,
  ImageCropper,
  Modal,
  ModalTitle,
  Paragraph,
  Switch,
  VerticalSpacing,
} from '@we-agile-you/react-base';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../spaces/app/hooks/useAppContext';
import { DISPLAY_NAME_MAX_LENGTH } from '../../spaces/auth/constants';
import { updateCurrentUser } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import {
  hotjarIdentify,
  HOTJAR_IDENTIFY_KEYS,
} from '../../vendors/hotjar/identify';
import { ProfileImagePicker } from '../ProfileImagePicker/ProfileImagePicker';
import styles from './EditDisplayNameModal.module.scss';

export type EditDisplayNameModalIsOpen = 'prompted' | true | false | null;

interface EditDisplayNameProps {
  isPromptedModal?: boolean;
  onClose: () => void;
}

export const EditDisplayNameModal = ({
  isPromptedModal,
  onClose,
}: EditDisplayNameProps) => {
  const { user, uid, isAnonymous } = useCurrentUser();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  const displayName = user?.displayName ? user.displayName : '';
  const [step, setStep] = useState<'display-options' | 'crop-image'>(
    'display-options',
  );

  const [formNameValue, setFormNameValue] = useState(displayName);
  const setIsOpenAuthType = useAppContext().authModal[1];

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSpectatorToggleChange = (isChecked: boolean) => {
    updateCurrentUser({
      isSpectator: isChecked,
    });
  };

  useEffect(() => {
    if (isPromptedModal && isAnonymous === false) {
      onClose();
    }
  }, [isPromptedModal, isAnonymous, onClose]);

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  function handleChangeFormDisplayName(displayName: string) {
    setFormNameValue(displayName);
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();

    if (!user || !formNameValue) return;

    updateCurrentUser({ displayName: formNameValue }).then(() => onClose());
  }

  const handleProfileImagePicked = (file: File) => {
    setProfilePictureFile(file);
    setStep('crop-image');
    hotjarIdentify(
      HOTJAR_IDENTIFY_KEYS.OPENED_PROFILE_IMAGE_PICKER_CROPPER,
      uid,
    );
  };

  return (
    <Modal onClose={onClose} isNotClosable={isPromptedModal}>
      {step === 'display-options' && (
        <>
          {isPromptedModal ? (
            <ModalTitle>Choose your display name</ModalTitle>
          ) : (
            <ModalTitle>Edit your display information</ModalTitle>
          )}
          <form onSubmit={handleFormSubmit}>
            {!isPromptedModal && (
              <>
                <ProfileImagePicker
                  onUpdated={() => null}
                  onPickImage={handleProfileImagePicked}
                />
                <VerticalSpacing spacing="spacing-xxl" />
              </>
            )}

            <FormInput
              label="Your display name"
              id="display-name"
              ref={inputRef}
              value={formNameValue}
              maxLength={DISPLAY_NAME_MAX_LENGTH}
              onChange={handleChangeFormDisplayName}
              required
            />

            <FormGroup isSubmit>
              {isPromptedModal && (
                <>
                  <Paragraph align="center" color="grey600">
                    <Switch
                      isChecked={!!user?.isSpectator}
                      onChangeSwitch={handleSpectatorToggleChange}
                    />{' '}
                    Join as spectator
                  </Paragraph>
                  <VerticalSpacing spacing="spacing-s" />
                </>
              )}
              <Button buttonType="submit" isBlock>
                {isPromptedModal ? 'Continue to game' : 'Save'}
              </Button>
            </FormGroup>
            {isPromptedModal && (
              <>
                <div className={styles['extra-actions']}>
                  <ButtonLink onClick={() => setIsOpenAuthType('sign-in')}>
                    Login
                  </ButtonLink>
                  <ButtonLink onClick={() => setIsOpenAuthType('sign-up')}>
                    Sign Up
                  </ButtonLink>
                </div>
              </>
            )}
          </form>
        </>
      )}
      {step === 'crop-image' && (
        <div>
          <ModalTitle>Crop your photo</ModalTitle>
          {profilePictureFile && (
            <ImageCropper
              image={profilePictureFile}
              onSaved={() => setStep('display-options')}
              onCancel={() => setStep('display-options')}
            />
          )}
        </div>
      )}
    </Modal>
  );
};
