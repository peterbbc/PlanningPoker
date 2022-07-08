import {
  ButtonLink,
  FlexBox,
  HoritzontalSpacing,
  ProfileImage,
  VerticalSpacing,
} from '../../../packages/react-base';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { updateCurrentUserPicture } from '../../spaces/auth/data/user';
import useCurrentUser from '../../spaces/auth/hooks/useCurrentUser';
import { DEFAULT_DISPLAY_NAME } from '../../spaces/poker-table/constants';

import styles from './ProfileImagePicker.module.scss';

interface ImagePickerProps {
  onPickImage: (image: File) => void;
  onUpdated: () => void;
}

export const ProfileImagePicker = ({
  onUpdated,
  onPickImage,
}: ImagePickerProps) => {
  const { user } = useCurrentUser();

  const handleFileSelected = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) {
      return;
    }

    onPickImage(file);

    // updateCurrentUserPicture(file, onUpdated);
  };

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    updateCurrentUserPicture(null, onUpdated);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileSelected,
    maxFiles: 1,
  });

  return (
    <>
      <div className={styles.imagePicker}>
        <div {...getRootProps()} className={styles.dropzone}>
          <FlexBox>
            <div>
              <input {...getInputProps()} />

              <ProfileImage
                src={user?.profilePictureUrl}
                alt={user?.displayName || DEFAULT_DISPLAY_NAME}
                size="xxl"
              />
            </div>
            <HoritzontalSpacing spacing="spacing-m" />
            <div>
              <ButtonLink>
                {user?.profilePictureUrl ? 'Upload new photo' : 'Upload photo'}
              </ButtonLink>
              {user?.profilePictureUrl && (
                <>
                  <VerticalSpacing spacing="spacing-m" />
                  <ButtonLink buttonColor="danger" onClick={handleDeleteClick}>
                    Delete photo
                  </ButtonLink>
                </>
              )}
            </div>
          </FlexBox>
        </div>
      </div>
    </>
  );
};
